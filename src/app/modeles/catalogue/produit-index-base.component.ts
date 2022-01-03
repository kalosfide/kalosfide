import { Component, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Categorie } from './categorie';
import { EtatsProduits, EtatProduit } from './etat-produit';
import { IKfVueTableDef } from '../../commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { Catalogue } from './catalogue';
import {
    KfListeDeroulanteNombre, KfListeDeroulanteTexte
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { CategoriePages } from 'src/app/fournisseur/catalogue/categories/categorie-pages';
import { ProduitPages } from 'src/app/fournisseur/catalogue/produits/produit-pages';
import { BootstrapType } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { Site } from '../site/site';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Compare } from 'src/app/commun/outils/tri';
import { KeyIdIndexComponent } from 'src/app/commun/data-par-key/key-id/key-id-index.component';


@Component({ template: '' })
export abstract class ProduitIndexBaseComponent extends KeyIdIndexComponent<Produit> implements OnDestroy {

    site: Site;

    categories: Categorie[];

    protected identifiantEstFournisseur: boolean;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);
        this.fixeDefRéglagesVueTable('catalogue.produits', (p: Produit) => p.id);
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

    avantChargeData() {
        this.site = this.service.litSiteEnCours();
    }

    /**
     * fixe la liste de la vueTable: surcharge du  cas par défaut où il y a un champ 'liste'
     * @param data Data résolu avec un champ 'catalogue'
     */
    protected chargeData(data: Data) {
        const catalogue: Catalogue = Catalogue.nouveau(data.catalogue);
        this.liste = catalogue.produits;
        this.categories = catalogue.catégories;
        this.liste.forEach(p => p.nomCategorie = this.categories.find(c => c.id === p.categorieId).nom);
    }

    private chargeEtatTable(etat: EtatTable) {
        const nbProduits = this.liste.length;
        // si l'utilisateur n'est pas le fournisseur, les produits n'ont pas de champ etat mais sont disponibles
        const nbDisponibles = this.liste.filter(p => p.disponible === undefined || p.disponible === null || p.disponible === true).length;
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
                    routeur: Fabrique.url.appRouteur.catégorie
                };
                texte = 'Créer une catégorie';
                type = 'danger';
            } else {
                message = `Il n'y a pas de produits dans le catalogue.`;
                urlDef = {
                    pageDef: ProduitPages.ajoute,
                    routeur: Fabrique.url.appRouteur.produit
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

    /**
     * Charge les options des filtres par catégorie et par état de produit.
     * Charge le groupe d'affichage de l'état de la liste.
     * Charge la liste dans la vueTable.
     * Appelée aprés le chargement de la liste de la table et la création du superGroupe.
     */
    protected chargeGroupe() {
        // charge les options du filtre par catégorie
        let filtre = this.vueTable.outils.outil(this.service.utile.nom.catégorie);
        const listeCatégories: KfListeDeroulanteNombre = filtre.composant as KfListeDeroulanteNombre;
        this.categories
            .map(c => ({ nom: c.nom, no: c.id }))
            .sort(Compare.texte(nom_no => nom_no.nom))
            .forEach(nom_no => listeCatégories.créeEtAjouteOption(nom_no.nom, nom_no.no));

        // charge les options du filtre par état de produit s'il est là
        filtre = this.vueTable.outils.outil(this.service.utile.nom.état);
        let listeEtats: KfListeDeroulanteTexte;
        if (filtre) {
            listeEtats = filtre.composant as KfListeDeroulanteTexte;
            EtatsProduits.états.forEach((e: EtatProduit) => listeEtats.créeEtAjouteOption(e.texte, e.valeur));
        }

        // charge le groupe d'affichage de l'état de la liste
        this.groupeTable.etat.charge();

        // charge la liste dans la vueTable
        this._chargeVueTable(this.liste);
    }

}
