import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';

import { ProduitPages } from './produit-pages';
import { ProduitIndexBaseComponent } from 'src/app/modeles/catalogue/produit-index-base.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { ProduitEditeur } from '../../../modeles/catalogue/produit-editeur';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { CataloguePages } from '../catalogue-pages';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { Site } from 'src/app/modeles/site/site';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { KfVueTableLigne } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
})
export class ProduitIndexComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = ProduitPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ProduitPages;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);
        this.identifiantEstFournisseur = true;
    }

    protected get barreTitreDef(): IBarreDef {
        const urlDef: IUrlDef = {
            pageDef: CataloguePages.categories,
            routeur: Fabrique.url.appRouteur.catalogue
        };
        const def = this._barreTitreDef;
        const groupeDef = Fabrique.titrePage.groupeRetour(Fabrique.lien.retour(urlDef));
        groupeDef.groupe.afficherSi(this.service.identification.conditionSite.catalogue);
        def.groupesDeBoutons = [groupeDef];
        return def;
    }

    protected contenuAidePage = (): KfComposant[] => {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    avantChargeData() {
        this.site = this.service.litSiteEnCours();
    }

    créeGroupeTableDef(): IGroupeTableDef<Produit> {
        const vueTableDef = this._créeVueTableDef();
        vueTableDef.colonnesDef = this.service.utile.colonne.colonnesFournisseur((this.quandLigneSupprimée).bind(this));
        vueTableDef.navigationAuClavier = { type: 'cellules', controlePagination: true, entréesEtActionsSeulement: true };
        vueTableDef.id = (produit: Produit) => {
            return this.service.fragment(produit);
        };

        vueTableDef.outils.ajoute(this.service.utile.outils.état());
        const outilAjoute = this.service.utile.outils.ajoute();
        outilAjoute.bbtnGroup.afficherSi(this.service.identification.conditionSite.catalogue);
        vueTableDef.outils.ajoute(outilAjoute);

        vueTableDef.itemRéférenceLigne = (produit: Produit, ligne: KfVueTableLigne<Produit>) => {
            produit.vueTableLigne = ligne;
        }
        vueTableDef.superGroupe = (produit: Produit) => {
            const editeur = new ProduitEditeur(this);
            const superGroupe = editeur.créeSuperGroupe();
            editeur.fixeValeur(produit);
            produit.editeur = editeur;
            const apiRequêteAction: (apiProduit: () => Produit) => ApiRequêteAction =
                (apiProduit: () => Produit) => {
                    return {
                        demandeApi: (() => {
                            return this.service.edite(apiProduit());
                        }).bind(this),
                        actionSiOk: (créé?: any) => {
                            this.service.quandEdite(produit);
                            produit.vueTableLigne.quandItemModifié();
                        },
                        formulaire: superGroupe
                    }
                }
            Fabrique.input.prépareSuitValeurEtFocus(editeur.kfPrix, apiRequêteAction(() => produit.apiProduitPrix), this.service);
            Fabrique.listeDéroulante.prépareSuitValeurEtFocus(editeur.kfEtat, apiRequêteAction(() => produit.apiProduitEtat), this.service);
            superGroupe.avecInvalidFeedback = true;
            return superGroupe;
        };
        const etatTable = this._créeEtatTable();
        return {
            vueTableDef,
            etatTable
        };
    }

    quandLigneSupprimée(index: number, aprésSuppression: Catalogue) {
        this.liste = aprésSuppression.produits;
        this.vueTable.supprimeItem(index);
    }

    calculeModeTable(): ModeTable {
        return !this.site.ouvert ? ModeTable.edite : ModeTable.aperçu;
    }

    rafraichit(site: Site) {
        this.site = site;
        this.service.changeModeTable(this.calculeModeTable());
        this.barre.site = site;
        this.barre.rafraichit();
    }

    aprèsChargeData() {
        const site = this.service.litSiteEnCours();
        this.rafraichit(site);
        this.subscriptions.push(this.service.identification.souscritASiteChange(this.rafraichit.bind(this)));
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            initialiseUtile: () => this.service.initialiseModeTable(this.calculeModeTable()),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }

}
