import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { CLFService } from './c-l-f.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { CLFDoc } from './c-l-f-doc';
import { CLFUtile } from './c-l-f-utile';
import { CLFDocs } from './c-l-f-docs';
import { ModeAction } from './condition-action';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';

/**
 * Route: fournisseur: document/client/:keyClient/liste, client: document/liste
 * Page de choix du document terminé à afficher
 * Table des documents terminés avec lien vers fournisseur: document/client/:keyClient/type/:keyNoDoc, client: document/type/:keyNoDoc.
 */
@Component({ template: '' })
export abstract class CLFDocsComponent extends PageTableComponent<CLFDoc> implements OnInit, OnDestroy {

    date: Date;

    clfDocs: CLFDocs;

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
        this.fixeDefRéglagesVueTable('documents', (d: CLFDoc) => [d.type, d.id, d.no].join('_'));
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    get texteUtile() {
        return this.utile.texte.textes(this.clfDocs.type);
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
        });

        this.barre = barre;

        return barre;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFDoc> {
        const outils = Fabrique.vueTable.outils<CLFDoc>();
        outils.ajoute(this.utile.outils.type());
        const vueTableDef: IKfVueTableDef<CLFDoc> = {
            outils,
            colonnesDef: this.utile.colonne.docCLF.defsDocuments(),
            quandClic: (clfDoc: CLFDoc) => (() => this.service.routeur.navigueUrlDef(this.utile.url.document(clfDoc))).bind(this),
        };
        const site = this.service.identification.siteEnCours;
        const estFournisseur = !site.client;
        if (estFournisseur) {
            vueTableDef.triInitial = { colonne: 'date', direction: 'desc' };
            vueTableDef.pagination = Fabrique.vueTable.pagination<CLFDoc>('document');
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
        this.groupeTable = new GroupeTable<CLFDoc>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    rafraichit() {
        this.barre.rafraichit();
    }

    chargeData(data: Data) {
        this.clfDocs = data.clfDocs;
        this.liste = this.clfDocs.créeRésumés();
        if (this.service.clientEnCoursIo) {
            this.service.clientEnCoursIo.changeValeur(this.clfDocs.client);
        }
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

    créePageTableDef(): IPageTableDef {
        return {
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
