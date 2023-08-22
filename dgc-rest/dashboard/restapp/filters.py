# import django_filters
# from .models import Mandat, Ordonnateur


# class OrdonnateurFilter(django_filters.FilterSet):
#     class Meta:
#         model = Ordonnateur
#         fields = {
#             'service': ['exact'],
#             'code': ['contain'],
#             'libelle': ['contain'],
#             'code_pst': ['exact'],
#         }


# class MandatFilter(django_filters.FilterSet):
#     class Meta:
#         model = Mandat
#         fields = {
#             'num': ['exact'],
#             'ord__service': ['exact'],
#             'ord__code': ['contain'],
#             'mois': ['exact', 'lt', 'gt', 'lte', 'gte'],
#             'gestion': ['exact'],
#         }
