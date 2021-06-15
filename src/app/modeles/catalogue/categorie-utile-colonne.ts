import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CategorieUtile } from './categorie-utile';
import { Categorie } from './categorie';
import { Compare } from '../../commun/outils/tri';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';

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

    action(quandLigneSupprimée: (catégorie: Categorie) => void): IKfVueTableColonneDef<Categorie> {
        return {
            nom: 'action',
            créeContenu: (catégorie: Categorie) => {
                const btnGroup = new KfBBtnGroup('action');
                let bouton: KfBBtnGroupElement;
                bouton = this.utile.lien.edite(catégorie);
                btnGroup.ajoute(bouton);
                bouton = this.utile.bouton.supprime(catégorie, quandLigneSupprimée);
                bouton.inactivité = catégorie.nbProduits > 0;
                btnGroup.ajoute(bouton);
                return btnGroup;
            },
            classeDefs: ['colonne-btn-group-2'],
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    colonnes(quandLigneSupprimée: (catégorie: Categorie) => void): IKfVueTableColonneDef<Categorie>[] {
        return [
            this.nom(),
            this.produits(),
            this.action(quandLigneSupprimée),
        ];
    }

}
