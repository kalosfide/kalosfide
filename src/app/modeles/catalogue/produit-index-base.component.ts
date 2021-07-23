import { Component, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { KeyUidRnoNoIndexComponent } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no-index.component';
import { Categorie } from './categorie';
import { IdEtatProduit, EtatsProduits, EtatProduit } from './etat-produit';
import { IKfVueTableDef } from '../../commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { Catalogue } from './catalogue';
import {
    KfListeDeroulanteNombre, KfListeDeroulanteTexte
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { CategoriePages, CategorieRoutes } from 'src/app/fournisseur/catalogue/categories/categorie-pages';
import { ProduitPages, ProduitRoutes } from 'src/app/fournisseur/catalogue/produits/produit-pages';
import { BootstrapType } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { Site } from '../site/site';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';


@Component({ template: '' })
export abstract class ProduitIndexBaseComponent extends KeyUidRnoNoIndexComponent<Produit> implements OnDestroy {

    site: Site;

    categories: Categorie[];

    protected identifiantEstFournisseur: boolean;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);
    }

    protected _créeVueTableDef(): IKfVueTableDef<Produit> {
        const outils = Fabrique.vueTable.outils<Produit>();
        outils.ajoute(this.service.utile.outils.produit());
        outils.ajoute(this.service.utile.outils.catégorie());
        outils.texteRienPasseFiltres = `Il n'y a pas de produits correspondant aux critères de recherche.`;

        const vueTableDef: IKfVueTableDef<Produit> = {
            colonnesDef: this.service.utile.colonne.colonnes(),
            outils,
            triInitial: { colonne: this.service.utile.nom.catégorie, direction: 'asc' },
            pagination: Fabrique.vueTable.pagination<Produit>('produit')
        };
        return vueTableDef;
    }

    protected _créeEtatTable(): EtatTable {
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => this.chargeEtatTable(etat)).bind(this)
        });
        return etatTable;
    }

    créeGroupeTableDef(): IGroupeTableDef<Produit> {
        const vueTableDef = this._créeVueTableDef();
        const etatTable = this._créeEtatTable();
        return {
            vueTableDef,
            etatTable
        };
    }

    get produits(): Produit[] { return this.liste as Produit[]; }
    get nomsCategories(): string[] {
        return this.produits.map(p => p.nomCategorie);
    }

    /**
     * fixe la liste de la vueTable: surcharge du  cas par défaut où il y a un champ 'liste'
     * @param data Data résolu avec un champ 'catalogue'
     */
    protected chargeData(data: Data) {
        const catalogue: Catalogue = Catalogue.nouveau(data.catalogue);
        this.liste = catalogue.produits;
        this.categories = catalogue.catégories;
        this.liste.forEach(p => p.nomCategorie = this.categories.find(c => c.no === p.categorieNo).nom);
    }

    private chargeEtatTable(etat: EtatTable) {
        const nbProduits = this.liste.length;
        // si l'utilisateur n'est pas le fournisseur, les produits n'ont pas de champ etat mais sont disponibles
        const nbDisponibles = this.liste.filter(p => p.etat === undefined || p.etat === null || p.etat === IdEtatProduit.disponible).length;
        const nbCatégories = this.categories.length;
        let message: string;
        let urlDef: IUrlDef;
        let texte: string;
        let type: BootstrapType;
        if (nbProduits === 0) {
            if (nbCatégories === 0) {
                message = 'Le catalogue est vide. Vous devez créer au moins une catégorie et y ajouter des produits.';
                urlDef = {
                    pageDef: CategoriePages.ajoute,
                    routes: CategorieRoutes,
                    urlSite: () => this.site.url
                };
                texte = 'Créer une catégorie';
                type = 'danger';
            } else {
                message = `Il n'y a pas de produits dans le catalogue.`;
                urlDef = {
                    pageDef: ProduitPages.ajoute,
                    routes: ProduitRoutes,
                    urlSite: () => this.site.url
                };
                texte = 'Créer un produit';
                type = 'danger';
            }
        } else {
            if (nbDisponibles === 0) {
                message = `Il n'y a pas de produits disponibles dans le catalogue.`;
                type = 'warning';
            } else {
                message = `Le catalogue propose ${nbDisponibles === 1 ? 'un produit' : nbDisponibles + ' produits'}`
                    + ` dans ${nbCatégories === 1 ? 'une catégorie' : nbCatégories + ' catégories'}.`;
                type = 'success';
            }
        }
        etat.grBtnsMsgs.messages[0].fixeTexte(message);
        if (type === 'danger') {
            let lienDef: ILienDef;
            if (urlDef || texte) {
                lienDef = {
                    urlDef,
                    contenu: { texte }
                };
            }
            etat.grBtnsMsgs.afficherBoutons = true;
            Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, lienDef);
        } else {
            etat.grBtnsMsgs.afficherBoutons = false;
        }
        etat.grBtnsMsgs.alerte(type);
    }

    protected chargeGroupe() {
        let filtre = this.vueTable.outils.outil(this.service.utile.nom.catégorie);
        const listeCatégories: KfListeDeroulanteNombre = filtre.composant as KfListeDeroulanteNombre;
        this.categories.forEach((c: Categorie) => listeCatégories.créeEtAjouteOption(c.nom, c.no));
        filtre = this.vueTable.outils.outil(this.service.utile.nom.état);
        if (filtre) {
            const listeEtats: KfListeDeroulanteTexte = filtre.composant as KfListeDeroulanteTexte;
            EtatsProduits.etats.forEach((e: EtatProduit) => listeEtats.créeEtAjouteOption(e.texte, e.valeur));
        }
        this.groupeTable.etat.charge();
        this._chargeVueTable(this.liste);
    }

    avantChargeData() {
        this.site = this.service.navigation.litSiteEnCours();
    }

}
