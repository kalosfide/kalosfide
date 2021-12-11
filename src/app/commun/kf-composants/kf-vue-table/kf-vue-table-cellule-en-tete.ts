import { KfVueTableCelluleBase, IKfVueTableCellule } from './kf-vue-table-cellule-base';
import { KfVueTableColonne } from './kf-vue-table-colonne';
import { KfNgClasse, KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfTypeDEvenement, KfTypeDHTMLEvents } from '../kf-partages/kf-evenements';
import { KfVueTableLigneEnTete } from './kf-vue-table-ligne-en-tete';

export class KfVueTableCelluleEnTete<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {

    constructor(colonne: KfVueTableColonne<T>, ligne: KfVueTableLigneEnTete<T>) {
        super(colonne, ligne);
        this.thScope = 'col';
        if (colonne.tri) { 
            this.géreHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
            this.géreHtml.ajouteTraiteur(KfTypeDEvenement.click,
                () => {
                    this.vueTable.trie(this.pColonne);
                });
        }
    }

    /**
     * Crée le contenu à partir du titreDef de l'en-tête de la colonne
     */
    créeContenu() {
        this._créeContenu(this.colonne.enTeteDef ? this.colonne.enTeteDef.titreDef : undefined, KfTypeDeComposant.etiquette);
        this.pContenu.ajouteClasse('kf-vue-table-en-tete');
        if (this.pColonne.tri) {
            const asc: KfNgClasseDef = { nom: 'kf-vue-table-tri-asc', active: () => this.pColonne.tri.direction === 'asc' };
            const desc: KfNgClasseDef = { nom: 'kf-vue-table-tri-desc', active: () => this.pColonne.tri.direction === 'desc' };
            this.pContenu.ajouteClasse('kf-vue-table-tri', asc, desc);
            if (!this.vueTable.nePasMontrerIconeDeTriSiPasTrié) {
                const aucun: KfNgClasseDef = { nom: 'kf-vue-table-tri-', active: () => this.pColonne.tri.direction === '' };
                this.pContenu.ajouteClasse(aucun);
            }
        }
    }

    /**
     * Crée le contenu à partir du chapeauDef de l'en-tête de la colonne
     */
    créeContenuChapeau() {
        this._créeContenu(this.colonne.enTeteDef.chapeauDef, KfTypeDeComposant.etiquette);
        this.pContenu.ajouteClasse('kf-vue-table-en-tete');
    }

    /**
     * KfNgClasse de l'élément th de l'en-tête.
     */
     get classe(): KfNgClasse {
        return this.pColonne.classeEnteteTh;
    }

    /**
     * KfNgClasse de l'élément div ajouté autour du contenu de l'en-tête s'il existe.
     */
     get classeDiv(): KfNgClasse {
        return this.pColonne.classeEnteteDiv;
    }
}
