from django.http import HttpResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, filters, generics, views
from .serializers import BenifSerializer, MandatListSerializer, OrdonnateurSerializer, MandatSerializer, PersonneSerializer, PortefSerializer
from .models import BenifMandat, Ordonnateur, Mandat, Personne, Portefeuille
from django.db import connection, models
from django.apps import apps
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import Length
from django.db.models import Case, When, Value, Count
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django.core.files.base import ContentFile
import pdfkit
from django.core.serializers import serialize

class BasicSizePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class OrdonnateurViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ordonnateur.objects.all().order_by('code_ord')
    serializer_class = OrdonnateurSerializer
    pagination_class = BasicSizePagination
    filterset_fields = {
        'code_ord': ['exact', 'icontains'],
        'libelle_ord': ['exact', 'icontains'],
        'type_service': ['exact'],
    }


class MandatListViewSet(viewsets.ModelViewSet):
    queryset = Mandat.objects.all().order_by('-dt_emission')
    serializer_class = MandatListSerializer
    pagination_class = BasicSizePagination
    filterset_fields = {
        'num': ['exact'],
        'ord__service': ['exact'],
        'ord__code': ['exact', 'icontains'],
        'mois': ['exact', 'lt', 'gt', 'lte', 'gte'],
        'gestion': ['exact'],
        'dt_emission': ['exact'],
        'dt_reglement': ['exact'],
    }

    def get_queryset(self):
        queryset = self.queryset
        benif_id = self.request.GET.get('benif')
        if benif_id != None:
            queryset = queryset.filter(benifs__id=benif_id)
        return queryset


class BenifFilter(filters.FilterSet):
    nom_charge = filters.CharFilter(
        field_name="nom_charge", lookup_expr='icontains')
    num_compte = filters.CharFilter(
        field_name="num_compte", lookup_expr='icontains')

    class Meta:
        model = BenifMandat
        fields = '__all__'


class MandatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Mandat.objects.all()
    serializer_class = MandatSerializer
    pagination_class = BasicSizePagination
    filterset_fields = {
        'code_ord': ['icontains'],
        'code_mandat': ['icontains'],
        'dt_ref':  ['exact'],
        'dt_emission':  ['icontains'],
        'dt_dispo': ['icontains'],
        'dt_reglement':  ['icontains'],
        'dt_admission':  ['icontains'],
        'mois':  ['icontains'],
        'gestion':  ['icontains'],
        'cs_titre':  ['exact'],
    }

    def get_queryset(self):
        queryset = self.queryset.filter(cs_titre__isnull=False)
        mandat_state = self.request.GET.get('etat')
        if mandat_state:
            queryset = queryset.annotate(state=Case(
                When(dt_reglement__isnull=False, then=Value("Reglement")),
                When(dt_dispo__isnull=False, then=Value("Disponibilite")),
                When(dt_admission__isnull=False, then=Value("Admission")),
                When(dt_emission__isnull=False, then=Value("Emission")),
                default=Value("Inconnu")),
            ).filter(state__iexact=mandat_state)
        mntcat = self.request.GET.get('mntcat')
        if mntcat:
            queryset = queryset.annotate(mnt_type=Case(
                When(mt_brut__lt=1e6, then=Value("<1M")),
                When(mt_brut__gte=1e6, then=Value(">1M")),
                default=Value("<1M")),
            ).filter(mnt_type__exact=mntcat)
        return queryset

    @action(detail=False)
    def info(self, request):
        queryset = self.get_queryset()
        counts =list(queryset.filter(cs_titre__in=[1,2,3,4],).values('cs_titre').annotate(count=Count('cs_titre')))
        T1 = next((item for item in counts if item["cs_titre"] == "1"), {'cs_titre': '1', 'count': 0})
        T2 = next((item for item in counts if item["cs_titre"] == "2"), {'cs_titre': '2', 'count': 0})
        T3 = next((item for item in counts if item["cs_titre"] == "3"), {'cs_titre': '3', 'count': 0})
        T4 = next((item for item in counts if item["cs_titre"] == "4"), {'cs_titre': '4', 'count': 0})
        data =  {'T1':T1["count"],'T2':T2["count"],'T3':T3["count"],'T4':T4["count"],}
        return Response(data)

class PersonneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Personne.objects.all()  # .order_by('nom')
    serializer_class = PersonneSerializer
    pagination_class = BasicSizePagination
    filterset_fields = {
        'nom': ['icontains'],
        'idt_fiscal': ['icontains'],
        'num_compte':  ['icontains'],
        'num_reg_comm':  ['icontains'],
        'code_ord': ['icontains'],
        'adr':  ['icontains'],
    }
    ordering_fields = ['nom', 'idt_fiscal',
                       'num_compte', 'num_reg_comm', 'ordonnateur__code_ord']

    def get_queryset(self):
        queryset = self.queryset
        personne_type = self.request.GET.get('type')
        if personne_type == 'fonct':
            queryset = queryset.annotate(idt_fiscal_len=Length('idt_fiscal'))\
                .filter(idt_fiscal_len=12)
        if personne_type == 'fourn':
            queryset = queryset.annotate(idt_fiscal_len=Length('idt_fiscal'))\
                .filter(idt_fiscal_len__in=[15, 20])
        if personne_type == 'autre':
            queryset = queryset.annotate(idt_fiscal_len=Length('idt_fiscal'))\
                .exclude(idt_fiscal_len__in=[12, 15, 20]) | \
                queryset.filter(idt_fiscal__isnull=True)
        return queryset

    def list(self, request, *args, **kwargs):
        frm = self.request.GET.get('frm')
        if frm == 'txt':
            queryset = self.filter_queryset(self.get_queryset())
            returnedText = ""
            for person in queryset:
                values = (person.num_compte or '', person.idt_fiscal or '',
                          person.nom or '', person.adr or '')
                returnedText += '{}|{}|{}|{}|\n'.format(*values)
            returnedFile = ContentFile(returnedText)
            response = HttpResponse(returnedFile, 'text/plain')
            response['Content-Length'] = returnedFile.size
            response['Content-Disposition'] = 'attachment; filename="personnes.txt"'
            return response
        if frm == 'pdf':
            queryset = self.filter_queryset(self.get_queryset())
            rows = ""
            for person in queryset:
                values = (person.num_compte or '', person.idt_fiscal or '',
                          person.nom or '', person.adr or '')
                rows += '<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>\n'.format(
                    *values)
            head = """<head>
<style>
body{
  font-family: arial, sans-serif;
  font-size: 14px;
}
table {
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 4px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
h2 {
text-align: center
}
</style>
</head>"""
            html = f"""<!DOCTYPE html>
<html>
{head}
<body>

<h2>Liste du personnel</h2>

<table>
  <tr>
    <th>Compte</th>
    <th>IDT Fiscal</th>
    <th>Nom</th>
    <th>Adresse</th>
  </tr>
  {rows}
</table>

</body>
</html>"""
            bits = pdfkit.from_string(html, False, {
                'footer-right': "[page] / [topage]"
            })
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'inline; filename="personnes.pdf"'
            response.write(bits)
            return response

        return super().list(self, request, *args, **kwargs)

    @ action(detail=True, serializer_class=MandatSerializer)
    def mandats(self, request, pk=None):
        benif = self.get_object()
        mandats = benif.mandats.all()
        serializer = self.get_serializer(mandats, many=True)
        return Response(serializer.data)


class BenifMandatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BenifMandat.objects.all()
    serializer_class = BenifSerializer
    pagination_class = BasicSizePagination
    filterset_fields = {
        'nom_charge': ['icontains'],
        'num_compte': ['icontains'],
    }

import itertools

class CreditViewSet(views.APIView):
    def get(self, request, format=None):
        _titre = self.request.GET.get('titre')
        _portef = self.request.GET.get('portef')
        _prog = self.request.GET.get('prog')
        _sprog = self.request.GET.get('sprog')
        portef_filter = f"PORTEF like '%{_portef}%'" if _portef is not None else ''
        prog_filter = f"PROGRAM like '%{_prog}%'" if _prog is not None else ''
        sprog_filter = f"S_PROGRAM like '%{_sprog}%'" if _sprog is not None else ''
        filters = ' AND '.join(filter(None,(portef_filter,prog_filter,sprog_filter)))
        filters = 'WHERE '+filters if len(filters)>0 else ''
        _page = int(self.request.GET.get('page','1'))
        _page_size = int(self.request.GET.get('page_size','5'))
        page_start = (_page-1)*_page_size+1
        page_end = _page*_page_size
        paging = f'WHERE rn BETWEEN {page_start} AND {page_end}'
        titre_filter = f"AND CODE_SEC = '{_titre}'" if _titre is not None else  ''
        sql = f'''
        SELECT  PORTEF,
                ORD ORDON,
                PROGRAM,
                S_PROGRAM,CREDIT,DEPENSE,SOLDE
        FROM (
            SELECT
                DENSE_RANK() OVER (ORDER BY portef) rn,
                PORTEF,
                ORD,
                PROGRAM,
                S_PROGRAM,
                nvl(sum(CREDIT),0) CREDIT,
                nvl(sum(DEPENSE),0) DEPENSE,
                nvl(sum(SOLDE),0) SOLDE
            FROM
                (
                    SELECT
                            ROW_NUMBER() OVER (
                                PARTITION BY CODE_PORTEF,
                                SUBSTR(AXE_PROGRAME2, 0, 3),
                                PROGRAM,
                                SUBSTR(AXE_PROGRAME2, 5),
                                CODE_ORD
                        ORDER BY
                                mois DESC
                        ) rn,
                            CODE_PORTEF PORTEF,
                            CODE_ORD ORD,
                            SUBSTR(AXE_PROGRAME2, 0, 3) PROGRAM,
                            SUBSTR(AXE_PROGRAME2, 5) S_PROGRAM,
                            NVL(TOT_CREDIT, 0) CREDIT,
                            NVL(TOT_DEB, 0) DEPENSE,
                            NVL(SOLDE, 0) SOLDE
                    FROM
                        TAB_CREDIT
                    WHERE
                        -- CODE_SEC = '1'             -- titre
                        CODE_S_SEC = '0'             -- categ
                        AND TYPE_NOMENC = 'BF'
                        AND GESTION >= '2023'
            -- {titre_filter}
                )
            WHERE
                rn = 1
            GROUP BY
                PORTEF,
                ORD,
                PROGRAM,
                S_PROGRAM
            --{filters}
            ORDER BY PORTEF, ORD, PROGRAM, S_PROGRAM
            )
            {paging}
            '''
        with connection.cursor() as cursor:
            print(sql)
            cursor.execute(sql)
            records = cursor.fetchall()
            portefs = []
            counter = itertools.count()
            for row in records:
                portef, ordon, prog, sprog, credit, depense, solde = \
                row
                prf = next((p for p in portefs if p["code"]==portef), None)
                if prf is not None:
                    prf["credit"] += credit
                    prf["depense"] += depense
                    prf["solde"] += solde
                    prf["percent"] = round(prf["depense"]/prf["credit"]*100)
                else:
                    prf = {"id":next(counter),
                        "code":portef,
                           "credit":credit,
                            "depense":depense,
                            "solde":solde,
                            "percent":round(depense/credit*100),
                            "nodes":[]}
                    portefs.append(prf)
                
                ordd = next((o for o in prf["nodes"] if o["code"]==ordon), None)
                if ordd is not None:
                    ordd["credit"] += credit
                    ordd["depense"] += depense
                    ordd["solde"] += solde
                    ordd["percent"] = round(ordd["depense"]/ordd["credit"]*100)
                else:
                    ordd = {"id":next(counter),
                           "code":ordon,
                           "credit":credit,
                            "depense":depense,
                            "solde":solde,
                            "percent":round(depense/credit*100),
                            "nodes":[]}
                    prf["nodes"].append(ordd)

                prg = next((g for g in ordd["nodes"] if g["code"]==prog), None)
                if prg is not None:
                    prg["credit"] += credit
                    prg["depense"] += depense
                    prg["solde"] += solde
                    prg["percent"] = round(prg["depense"]/prg["credit"]*100)
                else:
                    prg = {"id":next(counter),
                           "code":prog,
                           "credit":credit,
                            "depense":depense,
                            "solde":solde,
                            "percent":round(depense/credit*100),
                            "nodes":[]}
                    ordd["nodes"].append(prg)

                sprg = next((sg for sg in prg["nodes"] if sg["code"]==sprog), None)
                if sprg is not None:
                    sprg["credit"] += credit
                    sprg["depense"] += depense
                    sprg["solde"] += solde
                    sprg["percent"] = round(sprg["depense"]/sprg["credit"]*100)
                else:
                    sprg = {"id":next(counter),
                            "code":sprog,
                            "credit":credit,
                            "depense":depense,
                            "solde":solde,
                            "percent":round(depense/credit*100),
                            }
                    prg["nodes"].append(sprg)
            cursor.close()
        with connection.cursor() as cursor:
            cursor.execute(f'''
                SELECT COUNT(DISTINCT CODE_PORTEF)
                FROM TAB_CREDIT 
                WHERE CODE_S_SEC = '0' -- categ
                AND TYPE_NOMENC = 'BF'
                AND GESTION >= '2023'
                {titre_filter}
            ''')
            count = cursor.fetchone()
            cursor.close()
        # data = json.loads('[{"id":"0","name":"Operating System","deadline":"2020-02-14T23:00:00.000Z","type":"SETUP","isComplete":true,"_hasContent":false,"nodes":null},{"id":"1","name":"VSCode","deadline":"2020-02-16T23:00:00.000Z","type":"SETUP","isComplete":true,"_hasContent":false,"nodes":[]},{"id":"2","name":"JavaScript","deadline":"2020-03-27T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"22","name":"Data Types","deadline":"2020-03-19T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"221","name":"Strings","deadline":"2020-03-17T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null},{"id":"222","name":"Numbers","deadline":"2020-03-18T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null}]},{"id":"23","name":"Objects","deadline":"2020-03-21T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"231","name":"Object Methods","deadline":"2020-03-19T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null},{"id":"232","name":"Garbage Collection","deadline":"2020-03-20T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null}]},{"id":"24","name":"Code Style","deadline":"2020-03-22T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":[]}]},{"id":"3","name":"React","deadline":"2020-04-07T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"31","name":"Create React App","deadline":"2020-03-31T23:00:00.000Z","type":"SETUP","isComplete":true,"_hasContent":false,"nodes":null},{"id":"32","name":"JSX","deadline":"2020-03-31T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null},{"id":"33","name":"Components","deadline":"2020-04-30T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":[]},{"id":"34","name":"Props","deadline":"2020-05-31T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"35","name":"State","deadline":"2020-06-30T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":[{"id":"351","name":"Remote State","deadline":"2020-07-31T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":[]},{"id":"352","name":"Local State","deadline":"2020-07-31T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":[]}]}]},{"id":"4","name":"Git","deadline":"2020-05-27T23:00:00.000Z","type":"SETUP","isComplete":false,"_hasContent":false,"nodes":[]},{"id":"5","name":"Node","deadline":"2020-06-17T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"51","name":"Express","deadline":"2020-06-09T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null}]},{"id":"6","name":"GraphQL","deadline":"2020-07-29T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"61","name":"Queries and Mutations","deadline":"2020-07-27T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"611","name":"Fields","deadline":"2020-07-19T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"612","name":"Arguments","deadline":"2020-07-20T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"613","name":"Aliases","deadline":"2020-07-21T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"614","name":"Fragments","deadline":"2020-07-22T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"6141","name":"Inline Fragments","deadline":"2020-07-22T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null}]},{"id":"615","name":"Variables","deadline":"2020-07-23T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"616","name":"Directives","deadline":"2020-07-24T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null}]}]}]')
        return Response({"count": count,"next": None,"previous": None, "results": portefs})


class PortefViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Portefeuille.objects.all().order_by('code_portef')
    serializer_class = PortefSerializer
    pagination_class = BasicSizePagination
    filterset_fields = {
        'code_portef': ['exact', 'icontains'],
        'lib_portef': ['exact', 'icontains'],
    }

class MandatTreeViewSet(views.APIView):
    def get(self, request, format=None):
        _titre = self.request.GET.get('titre')
        _portef = self.request.GET.get('portef')
        _prog = self.request.GET.get('prog')
        _sprog = self.request.GET.get('sprog')
        _mntcat = self.request.GET.get('mntcat')
        mnt_filter = ''
        if _mntcat == "<1M":
            mnt_filter = 'MT_BRUT < 1000000'
        elif _mntcat == ">1M":
            mnt_filter = 'MT_BRUT >= 1000000'

        portef_filter = f"CODE_PORTEF like '%{_portef}%'" if _portef is not None else ''
        prog_filter = f"SUBSTR(AXE_PROGRAME2, 0, 3) like '%{_prog}%'" if _prog is not None else ''
        sprog_filter = f"SUBSTR(AXE_PROGRAME2, 5) like '%{_sprog}%'" if _sprog is not None else ''
        titre_filter = f"CS_TITRE = '{_titre}'" if _titre is not None else  ''
        filters = ' AND '.join(filter(None,(titre_filter, portef_filter,prog_filter,sprog_filter,mnt_filter)))
        filters = 'AND '+filters if len(filters)>0 else ''
        _page = int(self.request.GET.get('page','1'))
        _page_size = int(self.request.GET.get('page_size','5'))
        page_start = (_page-1)*_page_size+1
        page_end = _page*_page_size
        paging = f'WHERE rn BETWEEN {page_start} AND {page_end}'
        sql = f'''
        SELECT
            *
        FROM
            (
                SELECT
                    DENSE_RANK() OVER (
                    ORDER BY
                        CODE_PORTEF
                    ) rn,
                    CODE_PORTEF PORTEF,
                    SUBSTR(AXE_PROGRAME2, 0, 3) PROG,
                    SUBSTR(AXE_PROGRAME2, 5) SPROG,
                    CODE_ORD ORDON,
                    CODE_MANDAT,
                    NVL(MT_BRUT,0) MT_BRUT,
                    NVL(MT_NET,0) MT_NET,
                    MOIS,
                    GESTION,
                    CS_TITRE
                FROM
                    MANDAT
                WHERE
                    GESTION >= 2023
                    AND TYPE_SERVICE = 'BF'
                    AND AXE_PROGRAME2 IS NOT NULL
                    AND DT_EMISSION IS NOT NULL
                    AND DT_ADMISSION IS NULL
                    {filters}
                ORDER BY
                    CODE_PORTEF,
                    CODE_ORD,
                    PROG,
                    SPROG
            )
            {paging}
            '''
        with connection.cursor() as cursor:
            print(sql)
            cursor.execute(sql)
            records = cursor.fetchall()
            portefs = []
            counter = itertools.count()
            for row in records:
                _, portef, prog, sprog, ordon, code_mandat, mt_brut, \
                    mt_net, mois, gestion, cs_titre = row
                prf = next((p for p in portefs if p["code"]==portef), None)
                if prf is None:
                    prf = {"id":next(counter),
                            "code":portef,
                            "titre":None,
                            "mt_brut":None,
                            "mt_net":None,
                            "mois":None,
                            "gestion":None,
                            "nodes":[]}
                    portefs.append(prf)
                
                ordd = next((o for o in prf["nodes"] if o["code"]==ordon), None)
                if ordd is None:
                    ordd = {"id":next(counter),
                           "code":ordon,
                            "titre":None,
                            "mt_brut":None,
                            "mt_net":None,
                            "mois":None,
                            "gestion":None,
                            "nodes":[]}
                    prf["nodes"].append(ordd)

                prg = next((g for g in ordd["nodes"] if g["code"]==prog), None)
                if prg is None:
                    prg = {"id":next(counter),
                           "code":prog,
                            "titre":None,
                            "mt_brut":None,
                            "mt_net":None,
                            "mois":None,
                            "gestion":None,
                            "nodes":[]}
                    ordd["nodes"].append(prg)

                sprg = next((sg for sg in prg["nodes"] if sg["code"]==sprog), None)
                if sprg is None:
                    sprg = {"id":next(counter),
                            "code":sprog,
                            "titre":None,
                            "mt_brut":None,
                            "mt_net":None,
                            "mois":None,
                            "gestion":None,
                            "nodes":[],
                            }
                    prg["nodes"].append(sprg)
                sprg = next((sg for sg in prg["nodes"] if sg["code"]==sprog), None)
                if sprg is None:
                    sprg = {"id":next(counter),
                            "code":sprog,
                            "titre":None,
                            "mt_brut":None,
                            "mt_net":None,
                            "mois":None,
                            "gestion":None,
                            }
                    prg["nodes"].append(sprg)

                mnd = {"id":next(counter),
                        "code":code_mandat,
                        "titre":cs_titre,
                        "mt_brut":mt_brut,
                        "mt_net":mt_net,
                        "mois":mois,
                        "gestion":gestion,
                        }
                sprg["nodes"].append(mnd)
            cursor.close()
        with connection.cursor() as cursor:
            cursor.execute(f'''
                SELECT COUNT(DISTINCT CODE_PORTEF)
                FROM MANDAT 
                WHERE GESTION >= 2023
                    AND TYPE_SERVICE = 'BF'
                    AND AXE_PROGRAME2 IS NOT NULL
                    AND DT_EMISSION IS NOT NULL
                    AND DT_DISPO IS NULL
                    {filters}
            ''')
            count = cursor.fetchone()
            cursor.close()
        # data = json.loads('[{"id":"0","name":"Operating System","deadline":"2020-02-14T23:00:00.000Z","type":"SETUP","isComplete":true,"_hasContent":false,"nodes":null},{"id":"1","name":"VSCode","deadline":"2020-02-16T23:00:00.000Z","type":"SETUP","isComplete":true,"_hasContent":false,"nodes":[]},{"id":"2","name":"JavaScript","deadline":"2020-03-27T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"22","name":"Data Types","deadline":"2020-03-19T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"221","name":"Strings","deadline":"2020-03-17T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null},{"id":"222","name":"Numbers","deadline":"2020-03-18T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null}]},{"id":"23","name":"Objects","deadline":"2020-03-21T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"231","name":"Object Methods","deadline":"2020-03-19T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null},{"id":"232","name":"Garbage Collection","deadline":"2020-03-20T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null}]},{"id":"24","name":"Code Style","deadline":"2020-03-22T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":[]}]},{"id":"3","name":"React","deadline":"2020-04-07T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"31","name":"Create React App","deadline":"2020-03-31T23:00:00.000Z","type":"SETUP","isComplete":true,"_hasContent":false,"nodes":null},{"id":"32","name":"JSX","deadline":"2020-03-31T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":null},{"id":"33","name":"Components","deadline":"2020-04-30T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":[]},{"id":"34","name":"Props","deadline":"2020-05-31T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"35","name":"State","deadline":"2020-06-30T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":[{"id":"351","name":"Remote State","deadline":"2020-07-31T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":false,"nodes":[]},{"id":"352","name":"Local State","deadline":"2020-07-31T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":[]}]}]},{"id":"4","name":"Git","deadline":"2020-05-27T23:00:00.000Z","type":"SETUP","isComplete":false,"_hasContent":false,"nodes":[]},{"id":"5","name":"Node","deadline":"2020-06-17T23:00:00.000Z","type":"LEARN","isComplete":true,"_hasContent":true,"nodes":[{"id":"51","name":"Express","deadline":"2020-06-09T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null}]},{"id":"6","name":"GraphQL","deadline":"2020-07-29T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"61","name":"Queries and Mutations","deadline":"2020-07-27T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"611","name":"Fields","deadline":"2020-07-19T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"612","name":"Arguments","deadline":"2020-07-20T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"613","name":"Aliases","deadline":"2020-07-21T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"614","name":"Fragments","deadline":"2020-07-22T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":true,"nodes":[{"id":"6141","name":"Inline Fragments","deadline":"2020-07-22T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null}]},{"id":"615","name":"Variables","deadline":"2020-07-23T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null},{"id":"616","name":"Directives","deadline":"2020-07-24T23:00:00.000Z","type":"LEARN","isComplete":false,"_hasContent":false,"nodes":null}]}]}]')
        return Response({"count": count,"next": None,"previous": None, "results": portefs})
