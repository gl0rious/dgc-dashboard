from .models import BenifMandat, Ordonnateur, Mandat, Personne, Portefeuille
from rest_framework import serializers


class OrdonnateurSerializer(serializers.ModelSerializer):
    # code_pst = serializers.SerializerMethodField('get_code_pst')

    # def get_code_pst(self, obj):
    #     return format(obj.code_pst, '02')

    class Meta:
        model = Ordonnateur
        fields = '__all__'


# class EmbededOrdonnateurSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Ordonnateur
#         fields = ('id', 'code', 'service')


class PersonneSerializer(serializers.ModelSerializer):
    # ord_code = serializers.CharField(source='ord.code')
    # ordonnateur = EmbededOrdonnateurSerializer(source='ord')
    # dt_emission = serializers.DateField(
    #     format="%d-%m-%Y", input_formats=['%d/%m/%Y',])

    class Meta:
        model = Personne
        fields = '__all__'
        # exclude = ('ord',)


class MandatSerializer(serializers.ModelSerializer):
    # ord_code = serializers.CharField(source='ord.code')
    # ordonnateur = EmbededOrdonnateurSerializer(source='ord')
    # benifs = BenifMandatSerializer(many=True)

    class Meta:
        model = Mandat
        fields = '__all__'
        # exclude = ('benifs',)


class MandatListSerializer(serializers.ModelSerializer):
    # ord_code = serializers.CharField(source='ord.code')
    # ordonnateur = EmbededOrdonnateurSerializer(source='ord')
    # mois = serializers.IntegerField(source='mois')

    class Meta:
        model = Mandat
        # fields = '__all__'
        # exclude = ('ord', 'benifs')
        exclude = ('benifs',)


class BenifSerializer(serializers.ModelSerializer):

    class Meta:
        model = BenifMandat
        fields = '__all__'
        # exclude = ('ord', 'benifs')

class PortefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portefeuille
        fields = '__all__'