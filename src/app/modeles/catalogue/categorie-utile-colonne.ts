import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CategorieUtile } from './categorie-utile';
import { Categorie } from './categorie';
import { Compare } from '../../commun/outils/tri';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';

export class CategorieUtileColonne extends DataUtileColonne {
    constructor(utile: CategorieUtile) {
        super(utile);
    }

    get utile(): CategorieUtile {
        return this._parent as CategorieUtile;
    }

    nom(): IKfVueTableColonneDef<Categorie> {
        const créeContenu = (catégorie: Categorie) => catégorie.nom;
        return {
            nom: this.utile.nom.catégorie,
            enTeteDef: { titreDef: 'Nom' },
            créeContenu,
            compare: Compare.texte(créeContenu)
        };
    }

    produits(): IKfVueTableColonneDef<Categorie> {
        return {
            nom: 'produits',
            enTeteDef: { titreDef: 'Produits' },
            créeContenu: (catégorie: Categorie) => catégorie.nbProduits.toString(),
            compare: Compare.nombre((catégorie: Categorie) => catégorie.nbProduits)
        };
    }

    édite(): IKfVueTableColonneDef<Categorie> {
        return {
            nom: 'edite',
            créeContenu: (catégorie: Categorie) => {
                const bouton = this.utile.lien.edite(catégorie);
                return bouton;
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    supprime(quandSupprimé: (index: number) => void): IKfVueTableColonneDef<Categorie> {
        return {
            nom: 'supprime',
            créeContenu: (catégorie: Categorie) => {
                const bouton = this.utile.bouton.supprime(catégorie, quandSupprimé);
                bouton.inactivité = catégorie.utilisé;
                return bouton;
            },
            classesCol: [KfBootstrap.classeTexte({ alignement: 'center' })],
            largeur: LargeurColonne.action,
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    colonnes(quandSupprimé: (index: number) => void): IKfVueTableColonneDef<Categorie>[] {
        return [
            this.nom(),
            this.produits(),
            this.édite(),
            this.supprime(quandSupprimé)
        ];
    }

}
