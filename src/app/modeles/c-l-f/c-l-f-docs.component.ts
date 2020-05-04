import { OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { CLFService } from './c-l-f.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { CLFDoc } from './c-l-f-doc';
import { CLFUtile } from './c-l-f-utile';
import { CLFDocs } from './c-l-f-docs';
import { ModeAction } from './condition-action';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

/**
 * Route: documents/liste
 * Page de choix du document terminé à afficher
 * Table des documents terminés avec lien vers document/type/:key.
 */
export abstract class CLFDocsComponent extends PageTableComponent<CLFDoc> implements OnInit, OnDestroy {

    site: Site;
    identifiant: Identifiant;
    barre: BarreTitre;

    date: Date;

    clfDocs: CLFDocs;

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    get texteUtile() {
        return this.utile.texte.textes(this.clfDocs.type);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
        });

        this.barre = barre;

        return barre;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFDoc> {
        const outils = Fabrique.vueTable.outils<CLFDoc>(this.nom);
        if (this.identifiant.estFournisseur(this.site)) {
            outils.ajoute(this.utile.outils.clientDeDoc());
        }
        outils.ajoute(this.utile.outils.type());
        const vueTableDef: IKfVueTableDef<CLFDoc> = {
            outils,
            colonnesDef: this.utile.colonne.docCLF.defsDocuments(),
            id: (clfDoc: CLFDoc) => this.utile.url.idDeDocument(clfDoc),
        };
        if (this.identifiant.estFournisseur(this.site)) {
            vueTableDef.optionsDeTrieur = Fabrique.vueTable.optionsDeTrieur([
                { nomTri: 'client' },
            ]);
        }
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n\'a pas de documents enregistrés.`);
                etat.grBtnsMsgs.alerte('info');
            }).bind(this)
        });
        return {
            vueTableDef,
            etatTable
        };
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('documents');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<CLFDoc>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    rafraichit() {
        this.barre.rafraichit();
    }

    avantChargeData() {
        this.site = this.service.navigation.litSiteEnCours();
        this.identifiant = this.service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        this.clfDocs = data.clfDocs;
        this.liste = this.clfDocs.créeVues();
    }

    initialiseUtile() {
        this.service.changeMode(ModeAction.edite);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);

        this.ajouteGroupeDétails();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this.liste);
        this.groupeTable.etat.charge();
        this.rafraichit();
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
