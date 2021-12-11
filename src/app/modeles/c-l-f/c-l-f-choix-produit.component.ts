import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Client } from '../client/client';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { CLFLigne } from './c-l-f-ligne';
import { CLFService } from './c-l-f.service';
import { CLFUtile } from './c-l-f-utile';
import { RouteurService } from 'src/app/services/routeur.service';
import { CLFDoc } from './c-l-f-doc';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { TypeCLF } from './c-l-f-type';

@Component({ template: '' })
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

    protected fixeTypeDefRéglagesVueTable(type: TypeCLF) {
        this.fixeDefRéglagesVueTable(`${type}.produits`, (l: CLFLigne) => l.no2);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get _utile(): CLFUtile { return this.service.utile; }

    get client(): Client { return this.clfDoc.client; }

    créeBarreTitre = (): IBarreTitre => {
        const groupe = Fabrique.titrePage.groupeRetour(this._utile.lien.retourDeChoixProduit());
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [groupe]
        });
        return barre;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFLigne> {
        const outils = Fabrique.vueTable.outils<CLFLigne>();
        outils.ajoute(this._utile.outils.catégorie());
        outils.ajoute(this._utile.outils.produit());

        const vueTableDef: IKfVueTableDef<CLFLigne> = {
            colonnesDef: this._utile.colonne.ligne.defsChoixProduit(),
            outils,
            id: (ligne: CLFLigne) => {
                return this.service.fragment(ligne);
            },
            quandClic: (ligne: CLFLigne) => (() => this.routeur.navigueUrlDef(this._utile.url.ajoute(ligne))).bind(this),
            triInitial: { colonne: this._utile.nom.catégorie, direction: 'asc' },
            pagination: Fabrique.vueTable.pagination<CLFLigne>('produit')
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

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.service.utile.url.fixeRouteBon(this.clfDoc),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
