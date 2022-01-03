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
import { KfEntreeInputBool } from 'src/app/commun/kf-composants/kf-composants-types';

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

    produit(): KfVueTableFiltreCherche<Produit> {
        return Fabrique.vueTable.cherche<Produit>(this.utile.nom.produit, this.utile.nom.produit, 'Rechercher un produit');
    }

    catégorie(): KfVueTableFiltreNombre<Produit> {
        return Fabrique.vueTable.filtreNombre<Produit>(this.utile.nom.catégorie,
            (p: Produit, idCategorie: number) => p.categorieId === idCategorie, 'Filtrer par catégorie');
    }

    état(): KfVueTableFiltreTexte<Produit> {
        return Fabrique.vueTable.filtreTexte<Produit>(this.utile.nom.état,
        (p: Produit, oui_non: KfEntreeInputBool) => {
            return oui_non ? (oui_non === KfEntreeInputBool.oui && p.disponible) || !p.disponible : true;
        },
        'Filtrer par état');
    }

    ajoute(): KfVueTableOutilBtnGroupe<Produit> {
        return this.utile.outilsKey.outilAjoute();
    }

}
