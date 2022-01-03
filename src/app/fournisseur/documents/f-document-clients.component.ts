import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute, Data } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { FDocumentPages } from './f-document-pages';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { CLFClientBilanDocs } from 'src/app/modeles/c-l-f/c-l-f-bilan-docs';
import { CLFUtile } from 'src/app/modeles/c-l-f/c-l-f-utile';
import { RouteurService } from 'src/app/services/routeur.service';

/**
 * Affiche la liste par client des bilans (nombre et total des montants) des documents par type
 * pour choisir le client dont on va afficher la liste des documents.
 */
@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FDocumentClientsComponent extends PageTableComponent<CLFClientBilanDocs> implements OnInit, OnDestroy {


    date: Date;

    clientsBilanDocs: CLFClientBilanDocs[];

    pageDef: PageDef = FDocumentPages.clients;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
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

    avantChargeData() {
    }

    chargeData(data: Data) {
        this.clientsBilanDocs = data.clientsBilanDocs;
        this.liste = this.clientsBilanDocs;
        this.service.clientEnCoursIo.changeValeur(null);
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
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
