import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { CategorieUtile } from './categorie-utile';
import { CategorieUtileUrl } from './categorie-utile-url';
import { CategorieUtileLien } from './categorie-utile-lien';
import { Categorie } from './categorie';
import { KfVueTableOutilBtnGroupe } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil-btn-group';
import { KfVueTableFiltreCherche } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-filtre-cherche';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class CategorieUtileOutils extends DataUtileOutils {
    constructor(utile: CategorieUtile) {
        super(utile);
    }

    get utile(): CategorieUtile {
        return this._dataUtile as CategorieUtile;
    }

    get url(): CategorieUtileUrl {
        return this.utile.url;
    }

    get lien(): CategorieUtileLien {
        return this.utile.lien;
    }

    get nomOutil(): {
        catégorie: string,
    } {
        return {
            catégorie: 'catégorie',
        };
    }

    catégorie(): KfVueTableFiltreCherche<Categorie> {
        return Fabrique.vueTable.cherche<Categorie>(this.nomOutil.catégorie, 'Nom',
            (categorie: Categorie) => categorie.nom, 'Rechercher une catégorie');
    }

    ajoute(): KfVueTableOutilBtnGroupe<Categorie> {
        return this.utile.outilsKey.outilAjoute();
    }

}
