import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Client } from '../client/client';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { CLFLigne } from './c-l-f-ligne';
import { CLFService } from './c-l-f.service';
import { CLFUtile } from './c-l-f-utile';
import { RouteurService } from 'src/app/services/routeur.service';
import { CLFDoc } from './c-l-f-doc';

export abstract class CLFChoixProduitComponent extends PageTableComponent<CLFLigne> implements OnInit, OnDestroy {

    clfDoc: CLFDoc;

    get titre(): string {
        return !this.clfDoc.synthèse
            ? this.pageDef.titre
            : `${this.service.utile.texte.textes(this.clfDoc.synthèse.type).def.Bon}${this.clfDoc.no !== 0
                ? ' n° ' + this.clfDoc.no
                : ' virtuel'}${this.pageDef.titre ? ' - ' + this.pageDef.titre : ''}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get _utile(): CLFUtile { return this.service.utile; }

    get client(): Client { return this.clfDoc.client; }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            boutonsPourBtnGroup: [[], [this._utile.lien.retourDeChoixProduit()]]
        });

        return barre;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFLigne> {
        const outils = Fabrique.vueTable.outils<CLFLigne>(this.nom);
        outils.ajoute(this._utile.outils.catégorie());
        outils.ajoute(this._utile.outils.produit());

        const vueTableDef: IKfVueTableDef<CLFLigne> = {
            colonnesDef: this._utile.colonne.ligne.defsChoixProduit(),
            outils,
            id: (ligne: CLFLigne) => this._utile.url.id('' + ligne.produit.no),
            quandClic: (ligne: CLFLigne) => (() => this.routeur.navigueUrlDef(this._utile.url.ajoute(ligne))).bind(this),
            optionsDeTrieur: Fabrique.vueTable.optionsDeTrieur([
                { nomTri: 'catégorie' },
                { nomTri: 'produit' }
            ])
        };
        return {
            vueTableDef
        };
    }

    avantChargeData() {
    }

    chargeData(data: Data) {
        this.clfDoc = data.clfDoc;
        this.liste = this.clfDoc.produitsACommander().lignes;
    }

    créeSuperGroupe() {
        this.créeGroupe('super');
    }

    protected chargeGroupe() {
        this._utile.outils.chargeCatégories(this.vueTable, this.clfDoc.clfDocs.catalogue.catégories);
        this._chargeVueTable(this.liste);
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.service.utile.url.fixeRouteDoc(this.clfDoc),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
