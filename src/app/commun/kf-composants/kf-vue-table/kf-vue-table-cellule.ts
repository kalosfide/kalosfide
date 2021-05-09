import { KfVueTableColonne } from './kf-vue-table-colonne';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';
import { IKfVueTableCellule, KfVueTableCelluleBase } from './kf-vue-table-cellule-base';
import { KfVueTableNavigationParCellule } from './kf-vue-table-navigation-par-cellule';

export class KfVueTableCellule<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {
    item: T;

    constructor(colonne: KfVueTableColonne<T>, ligne: KfVueTableLigne<T>, item: T) {
        super(colonne, ligne);
        this.item = item;

        const celluleDef: KfVueTableCelluleDef = this.estDansColonneDesNuméros
            ? '' + (ligne.index + 1)
            : colonne.créeContenu(item);
        this.créeContenu(celluleDef);
        if (this.vueTable.navigationAuClavier && this.vueTable.navigationAuClavier.type === 'cellules') {
            const navigation = this.vueTable.navigationAuClavier as KfVueTableNavigationParCellule<T>;
            const quandFocusPris = () => navigation.quandCellulePrendFocus(this);
            const quandFocusPerdu = () => navigation.quandCellulePerdFocus();
        
            if (this.aContenuEditable) {
                this.pGéreHtml.fixeAttribut('tabindex', '-1');
                this.pContenu.gereHtml.suitLeFocus(quandFocusPris, quandFocusPerdu);
            } else {
                if (!navigation.entréesEtActionsSeulement || this.aContenuClicable) {
                    this.pGéreHtml.fixeAttribut('tabindex', '0');
                    this.pGéreHtml.suitLeFocus(quandFocusPris, quandFocusPerdu);
                }
            }
        }
    }

    get ligne(): KfVueTableLigne<T> {
        return this.pLigne as KfVueTableLigne<T>;
    }

    get classe(): KfNgClasse {
        return this.pColonne.classeItem(this.item);
    }

    get tabindex(): string {
        return this.pGéreHtml.attribut('tabindex');
    }

    get estDansColonneDesNuméros(): boolean {
        return !this.pColonne.créeContenu;
    }

    get aContenuEditable(): boolean {
        return this.contenu.estEntree;
    }

    get aContenuClicable(): boolean {
        return this.contenu.type === KfTypeDeComposant.lien || this.contenu.type === KfTypeDeComposant.bouton;
    }

    get estFocusable(): boolean {
        return this.tabindex === '0' || this.aContenuEditable;
    }

    prendLeFocus(): boolean {
        if (this.aContenuEditable) {
            return this.contenu.gereHtml.prendLeFocus();
        } else {
            return this.géreHtml.prendLeFocus();
        }
    }

    /**
     * Mise à jour du texte du contenu si la cellule a pour contenu un texte dépendant de la valeur de l'item.
     */
    quandItemModifié() {
        if (this.pColonne.créeContenu) {
            const celluleDef = this.pColonne.créeContenu(this.item);
            if (celluleDef && (typeof (celluleDef) === 'string' || typeof (celluleDef) === 'function')) {
                this.contenu.fixeTexte(celluleDef);
            }
        }
    }
}
