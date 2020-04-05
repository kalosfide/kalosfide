import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { ProduitUtile } from './produit-utile';
import { ProduitUtileUrl } from './produit-utile-url';
import { ProduitUtileLien } from './produit-utile-lien';
import { Produit } from './produit';
import { KfVueTableOutilBtnGroupe } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil-btn-group';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfVueTableFiltreNombre } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-nombre';
import { KfVueTableFiltreTexte } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-texte';
import { IdEtatProduit, EtatsProduits } from './etat-produit';

export class ProduitUtileOutils extends DataUtileOutils {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._dataUtile as ProduitUtile;
    }

    get url(): ProduitUtileUrl {
        return this.utile.url;
    }

    get lien(): ProduitUtileLien {
        return this.utile.lien;
    }

    get nomOutil(): {
        catégorie: string,
        produit: string,
        état: string,
    } {
        return {
            produit: 'produit',
            catégorie: 'catégorie',
            état: 'état',
        };
    }

    produit(): KfVueTableFiltreCherche<Produit> {
        return Fabrique.vueTable.cherche<Produit>(this.nomOutil.produit, 'Produit', (p: Produit) => p.nom, 'Rechercher un produit');
    }

    catégorie(): KfVueTableFiltreNombre<Produit> {
        return Fabrique.vueTable.filtreNombre<Produit>(this.nomOutil.catégorie, 'Catégorie',
            (p: Produit, noCategorie: number) => p.categorieNo === noCategorie, 'Filtrer par catégorie');
    }

    état(): KfVueTableFiltreTexte<Produit> {
        return Fabrique.vueTable.filtreTexte<Produit>(this.nomOutil.état, 'Etat',
        (p: Produit, idEtat: IdEtatProduit) => {
            const etat = EtatsProduits.etat(idEtat);
            return etat ? etat.vérifie(p) : true;
        },
        'Filtrer par état');
    }

    ajoute(): KfVueTableOutilBtnGroupe<Produit> {
        return this.utile.outilsKey.outilAjoute();
    }

}
