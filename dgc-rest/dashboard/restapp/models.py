from django.db import models
from django.db.models.functions import Length

models.TextField.register_lookup(Length, 'length')


class Ordonnateur(models.Model):
    code_ord = models.CharField(max_length=10)
    # num_cpt_g = models.ForeignKey('Nomenc', models.DO_NOTHING, db_column='num_cpt_g', blank=True, null=True)
    libelle_ord = models.CharField(max_length=200, blank=True, null=True)
    type_ord = models.CharField(max_length=1, blank=True, null=True)
    code_ord_prim = models.ForeignKey('self', models.DO_NOTHING, db_column='code_ord_prim', blank=True, null=True)
    code_pst = models.CharField(max_length=2, blank=True, null=True)
    type_service = models.CharField(max_length=100, blank=True, null=True)
    num_rit = models.IntegerField(blank=True, null=True)
    cle = models.CharField(max_length=2, blank=True, null=True)
    code_portef = models.CharField(max_length=4, blank=True, null=True)
    ord_com = models.CharField(max_length=8, blank=True, null=True)
    wilaya_dlg = models.CharField(max_length=1, blank=True, null=True)
    ord_sec = models.CharField(max_length=1, blank=True, null=True)
    lib_portef = models.CharField(max_length=200, blank=True, null=True)
    id = models.FloatField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'ordonnateur'

class Personne(models.Model):
    code_pers = models.CharField(max_length=20)
    nom = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    dt_naiss = models.DateField(blank=True, null=True)
    lieu_naiss = models.CharField(max_length=200, blank=True, null=True)
    adr = models.CharField(max_length=500, blank=True, null=True)
    frm_jur = models.CharField(max_length=50, blank=True, null=True)
    idt_fiscal = models.CharField(max_length=100, blank=True, null=True)
    num_reg_comm = models.CharField(max_length=100, blank=True, null=True)
    num_compte = models.CharField(unique=True, max_length=30, blank=True, null=True)
    banque = models.CharField(max_length=3, blank=True, null=True)
    capital = models.FloatField(blank=True, null=True)
    rib = models.CharField(max_length=100, blank=True, null=True)
    code_ord = models.CharField(max_length=100,blank=True, null=True)
    agent = models.CharField(max_length=400, blank=True, null=True)
    obs = models.CharField(max_length=1000, blank=True, null=True)
    observ = models.CharField(max_length=1000, blank=True, null=True)
    id = models.FloatField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'personne'


class Mandat(models.Model):
    id = models.CharField(primary_key=True, max_length=20, db_column="num_mandat")
    # num_marche = models.ForeignKey('MarcheOp', models.DO_NOTHING, db_column='num_marche', blank=True, null=True)
    # num_ligne = models.ForeignKey('LigneCptSpec', models.DO_NOTHING, db_column='num_ligne', blank=True, null=True)
    mt_brut = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    mt_opposit = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    mt_rejete = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    mt_net = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    dt_emission = models.DateField(blank=True, null=True)
    code_ord = models.CharField(max_length=100, blank=True, null=True)
    # code_direction = models.ForeignKey('Direction', models.DO_NOTHING, db_column='code_direction', blank=True, null=True)
    dt_reglement = models.DateField(blank=True, null=True)
    journee = models.CharField(max_length=4, blank=True, null=True)
    mois = models.CharField(max_length=2, blank=True, null=True)
    motif_rejet = models.CharField(max_length=400, blank=True, null=True)
    dt_rejet = models.DateField(blank=True, null=True)
    dt_admission = models.DateField(blank=True, null=True)
    # num_ligne_cpt = models.ForeignKey('LigneCompte', models.DO_NOTHING, db_column='num_ligne_cpt', blank=True, null=True)
    gestion = models.CharField(max_length=4, blank=True, null=True)
    nat_ref = models.CharField(max_length=200, blank=True, null=True)
    reference = models.CharField(max_length=100, blank=True, null=True)
    dt_ref = models.DateField(blank=True, null=True)
    note_verif = models.CharField(max_length=1000, blank=True, null=True)
    num_cpt_g = models.CharField(max_length=10, blank=True, null=True)
    statut = models.CharField(max_length=100, blank=True, null=True)
    code_pers = models.ForeignKey('Personne', models.DO_NOTHING, db_column='code_pers', blank=True, null=True)
    mod_pay = models.CharField(max_length=20, blank=True, null=True)
    ref_pay = models.CharField(max_length=50, blank=True, null=True)
    dt_oppos = models.DateField(blank=True, null=True)
    dt_dispo = models.DateField(blank=True, null=True)
    ord_delegue = models.CharField(max_length=10, blank=True, null=True)
    type_service = models.CharField(max_length=2, blank=True, null=True)
    mt_oper = models.FloatField(blank=True, null=True)
    num_anal = models.CharField(max_length=30, blank=True, null=True)
    banque = models.CharField(max_length=20, blank=True, null=True)
    objet_pay = models.CharField(max_length=2, blank=True, null=True)
    si_admis = models.CharField(max_length=1, blank=True, null=True)
    si_dispo = models.CharField(max_length=1, blank=True, null=True)
    si_regle = models.CharField(max_length=1, blank=True, null=True)
    code_mandat = models.CharField(max_length=20, blank=True, null=True)
    pst_compta = models.CharField(max_length=2, blank=True, null=True)
    cpt_credit = models.CharField(max_length=10, blank=True, null=True)
    dt_annul = models.DateField(blank=True, null=True)
    num_rejet = models.FloatField(blank=True, null=True)
    si_oppos = models.CharField(max_length=1, blank=True, null=True)
    num_fiche = models.CharField(max_length=10, blank=True, null=True)
    code_oper_cd = models.CharField(max_length=10, blank=True, null=True)
    agent_emis = models.CharField(max_length=400, blank=True, null=True)
    agent_admis = models.CharField(max_length=400, blank=True, null=True)
    agent_admis_a = models.CharField(max_length=400, blank=True, null=True)
    agent_dispo = models.CharField(max_length=400, blank=True, null=True)
    agent_dispo_a = models.CharField(max_length=400, blank=True, null=True)
    agent_reg = models.CharField(max_length=400, blank=True, null=True)
    agent_reg_a = models.CharField(max_length=400, blank=True, null=True)
    agent_oppos = models.CharField(max_length=400, blank=True, null=True)
    agent_oppos_a = models.CharField(max_length=400, blank=True, null=True)
    si_admis_dec = models.CharField(max_length=1, blank=True, null=True)
    si_dispo_dec = models.CharField(max_length=1, blank=True, null=True)
    type_vir_ccp = models.CharField(max_length=1, blank=True, null=True)
    si_debit = models.CharField(max_length=1, blank=True, null=True)
    mt_rct_comp = models.FloatField(blank=True, null=True)
    axe_programe = models.CharField(max_length=20, blank=True, null=True)
    axe_programe2 = models.CharField(max_length=20, blank=True, null=True)
    axe_fonction = models.CharField(max_length=4, blank=True, null=True)
    code_portef = models.CharField(max_length=4, blank=True, null=True)
    type_action = models.CharField(max_length=1, blank=True, null=True)
    cs_titre = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mandat'
        # unique_together = (('gestion', 'num_cpt_g', 'code_ord', 'ord_delegue', 'code_mandat'),)

class BenifMandat(models.Model):
    code_pers = models.CharField(max_length=20, blank=True, null=True)
    num_mandat = models.ForeignKey('Mandat', models.DO_NOTHING, db_column='num_mandat', blank=True, null=True)
    banque = models.CharField(max_length=20, blank=True, null=True)
    mt_benif = models.FloatField(blank=True, null=True)
    mt_init = models.FloatField(blank=True, null=True)
    mt_rejet = models.FloatField(blank=True, null=True)
    num_compte = models.CharField(max_length=50, blank=True, null=True)
    num_ligne = models.FloatField(blank=True, null=True)
    nom_charge = models.CharField(max_length=500, blank=True, null=True)
    num_compte_s = models.CharField(max_length=20, blank=True, null=True)
    si_envoi = models.CharField(max_length=1, blank=True, null=True)
    num_chq_ccp = models.CharField(max_length=20, blank=True, null=True)
    si_cloture = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'benif_mandat'
        # unique_together = (('num_mandat', 'num_ligne'),)




class Portefeuille(models.Model):
    code_portef = models.CharField(primary_key=True, max_length=4)
    lib_portef = models.CharField(max_length=200, blank=True, null=True)
    type_portef = models.CharField(max_length=1, blank=True, null=True)
    code_portef2 = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'portef_list'