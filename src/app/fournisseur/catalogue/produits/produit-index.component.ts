import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ProduitPages, ProduitRoutes } from './produit-pages';
import { ProduitIndexBaseComponent } from 'src/app/modeles/catalogue/produit-index-base.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { ProduitEditeur } from '../../../modeles/catalogue/produit-editeur';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { CataloguePages, CatalogueRoutes } from '../catalogue-pages';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
    styleUrls: ['../../../commun/commun.scss']
})
export class ProduitIndexComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = ProduitPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ProduitPages;
    dataRoutes = ProduitRoutes;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
        protected siteService: SiteService,
    ) {
        super(route, service);
        this.identifiantEstFournisseur = true;
    }

    protected get barreTitreDef(): IBarreDef {
        const urlDef: IUrlDef = {
            pageDef: CataloguePages.categories,
            routes: CatalogueRoutes,
            nomSite: this.site.nomSite
        };
        const lien = Fabrique.lien.retour(urlDef);
        lien.afficherSi(this.service.utile.conditionSite.catalogue);
        const def = this._barreTitreDef;
        def.boutonsPourBtnGroup = [[lien]];
        return def;
    }

    protected contenuAidePage = (): KfComposant[] => {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    avantChargeData() {
        this.site = this.service.navigation.litSiteEnCours();
    }

    créeGroupeTableDef(): IGroupeTableDef<Produit> {
        const vueTableDef = this._créeVueTableDef();
        vueTableDef.colonnesDef = this.service.utile.colonne.colonnesFournisseur((this.quandLigneSupprimée).bind(this));
        vueTableDef.outils.ajoute(this.service.utile.outils.état());
        const outilAjoute = this.service.utile.outils.ajoute();
        outilAjoute.bbtnGroup.nePasAfficherSi(this.service.utile.conditionSite.pas_catalogue);
        vueTableDef.outils.ajoute(outilAjoute);
        vueTableDef.superGroupe = (produit: Produit) => {
            const editeur = new ProduitEditeur(this);
            const superGroupe = editeur.créeSuperGroupe();
            editeur.fixeValeur(produit);
            produit.editeur = editeur;
            let apiAction: ApiRequêteAction = {
                demandeApi: (() => {
                    return this.service.edite(produit.apiProduitPrix);
                }).bind(this),
                actionSiOk: (créé?: any) => this.service.quandEdite(produit),
                formulaire: superGroupe
            };
            Fabrique.input.prépareSuitValeurEtFocus(editeur.kfPrix, apiAction, this.service);
            apiAction = {
                demandeApi: (() => {
                    return this.service.edite(produit.apiProduitEtat);
                }).bind(this),
                actionSiOk: (créé?: any) => this.service.quandEdite(produit),
                formulaire: superGroupe
            };
            Fabrique.listeDéroulante.prépareSuitValeurEtFocus(editeur.kfEtat, apiAction, this.service);
            return superGroupe;
        };
        const etatTable = this._créeEtatTable();
        return {
            vueTableDef,
            etatTable
        };
    }

    quandLigneSupprimée() {
        this.liste = this.service.litProduits();
        this.chargeGroupe();
    }

    calculeModeTable(): ModeTable {
        return this.site.etat === IdEtatSite.catalogue ? ModeTable.edite : ModeTable.aperçu;
    }

    rafraichit() {
        this.service.changeModeTable(this.calculeModeTable());
    }

    aprèsChargeData() {
        this.subscriptions.push(
            this.service.navigation.siteObs().subscribe(() => this.rafraichit())
        );
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.initialiseUtile = () => this.service.initialiseModeTable(this.calculeModeTable());
        this.pageTableDef.aprèsChargeData = () => this.aprèsChargeData();
    }

}
