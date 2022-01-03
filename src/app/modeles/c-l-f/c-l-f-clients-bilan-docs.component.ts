import { Component, OnInit, OnDestroy } from '@angular/core';

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
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { CLFUtile } from './c-l-f-utile';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { CLFClientBilanDocs } from './c-l-f-bilan-docs';

/**
 * Route: documents/liste
 * Page de choix du document terminé à afficher
 * Table des documents terminés avec lien vers document/type/:key.
 */
@Component({ template: '' })
export abstract class CLFClientsBilanDocsComponent extends PageTableComponent<CLFClientBilanDocs> implements OnInit, OnDestroy {

    site: Site;
    identifiant: Identifiant;

    date: Date;

    clientsBilanDocs: CLFClientBilanDocs[];

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
        });

        this.barre = barre;

        return barre;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFClientBilanDocs> {
        const outils = Fabrique.vueTable.outils<CLFClientBilanDocs>();
        const site = this.service.identification.siteEnCours;
        const estFournisseur = !site.client;
        if (estFournisseur) {
            outils.ajoute(this.utile.outils.clientDeClientBilanDocs());
        }
        const vueTableDef: IKfVueTableDef<CLFClientBilanDocs> = {
            outils,
            colonnesDef: this.utile.colonne.clientBilanDoc.defsClientsBilansDocs(),
            quandClic: (bilans: CLFClientBilanDocs) => (() => this.service.routeur.navigueUrlDef(this.utile.url.documentsClient(bilans.client))).bind(this),
        };
        if (estFournisseur) {
            vueTableDef.triInitial = { colonne: this.utile.nom.client, direction: 'asc' };
            vueTableDef.pagination = Fabrique.vueTable.pagination<CLFClientBilanDocs>('bon');
        }
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: false,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n'y a pas de documents enregistrés.`);
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
        this.groupeTable = new GroupeTable<CLFClientBilanDocs>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    rafraichit() {
        this.barre.rafraichit();
    }

    chargeData(data: Data) {
        this.clientsBilanDocs = data.clientsBilanDocs;
        this.liste = this.clientsBilanDocs;
    }

    initialiseUtile() {
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);

        this.ajouteGroupeDétails();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this.liste);
        this.groupeTable.etat.charge();
    }

    créePageTableDef(): IPageTableDef {
        return {
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
