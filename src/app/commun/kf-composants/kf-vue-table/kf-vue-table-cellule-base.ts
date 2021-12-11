import { KfComposant } from '../kf-composant/kf-composant';
import { KfVueTableColonne, IKfVueTableColonne } from './kf-vue-table-colonne';
import { KfVueTable } from './kf-vue-table';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfStringDef } from '../kf-partages/kf-string-def';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfTexte } from '../kf-elements/kf-texte/kf-texte';
import { KfVueTableLigneBase, IKfVueTableLigne } from './kf-vue-table-ligne-base';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';
import { KfComposantGereHtml } from '../kf-composant/kf-composant-gere-html';

export interface IKfVueTableCellule {
    colonne: IKfVueTableColonne;
    ligne?: IKfVueTableLigne;
    contenu: KfComposant;
    colSpan?: number;
    rowSpan?: number;
    thScope: string;
    tabindex?: string;
    géreHtml: KfComposantGereHtml;
}

export abstract class KfVueTableCelluleBase<T> {

    /**
     * Colonne contenant la cellule
     */
    protected pColonne: KfVueTableColonne<T>;

    /**
     * Ligne contenant la cellule
     */
    protected pLigne: KfVueTableLigneBase<T>;

    /**
     * Contenu de la cellule à afficher dans le template
     */
    protected pContenu: KfComposant;

    /**
     * Nombre de colonnes sur lesquelles s'étend la cellule
     */
    protected pColSpan: number | (() => number);

    /**
     * Nombre de lignes sur lesquelles s'étend la cellule.
     */
    private pRowSpan: number;

    /**
     * Gére le comportement de l'élément td de la cellule.
     */
    protected pGéreHtml: KfComposantGereHtml;

    protected pNePasAfficher: boolean | (() => boolean);

    thScope: string;

    constructor(colonne: KfVueTableColonne<T>, ligne: KfVueTableLigneBase<T>) {
        this.pColonne = colonne;
        this.pLigne = ligne;
        this.pGéreHtml = new KfComposantGereHtml();
        ligne.géreHtml.ajouteEnfant(this.pGéreHtml);
    }

    /**
     * VueTable contenant la cellule
     */
    get vueTable(): KfVueTable<T> {
        return this.colonne.vueTable;
    }

    /**
     * Colonne contenant la cellule
     */
    get colonne(): KfVueTableColonne<T> {
        return this.pColonne;
    }

    get nom(): string {
        return this.pColonne.nom + this.pLigne.nom;
    }

    /**
     * Nombre de colonnes sur lesquelles s'étend la cellule
     */
    get colSpan(): number {
        if (this.pColSpan !== undefined) {
            if (typeof (this.pColSpan) === 'number') {
                return this.pColSpan;
            } else {
                return this.pColSpan();
            }
        }
    }

    set colSpan(valeur: number) {
        this.pColSpan = valeur;
    }

    /**
     * Nombre de lignes sur lesquelles s'étend la cellule
     */
    get rowSpan(): number {
        return this.pRowSpan;
    }

    set rowSpan(valeur: number) {
        this.pRowSpan = valeur;
    }


    get nePasAfficher(): boolean {
        if (this.pNePasAfficher !== undefined) {
            if (typeof (this.pNePasAfficher) === 'boolean') {
                return this.pNePasAfficher || this.pColonne.nePasAfficher;
            } else {
                return this.pNePasAfficher();
            }
        } else {
            return this.pColonne.nePasAfficher;
        }
    }
    set nePasAfficher(valeur: boolean) {
        this.pNePasAfficher = valeur;
    }


    protected _créeContenu(celluleDef: KfVueTableCelluleDef, type?: KfTypeDeComposant.etiquette) {
        let stringDef: KfStringDef;
        if (!celluleDef) {
            stringDef = '';
        } else {
            if (typeof (celluleDef) === 'string') {
                stringDef = celluleDef;
            } else {
                if (typeof (celluleDef) === 'function') {
                    stringDef = celluleDef;
                } else {
                    this.pContenu = celluleDef.composant;
                    return;
                }
            }
        }
        this.pContenu = type ? new KfEtiquette(this.nom, stringDef) : new KfTexte(this.nom, stringDef);
    }
    protected créeContenu(celluleDef: KfVueTableCelluleDef, type?: KfTypeDeComposant.etiquette) {
        this._créeContenu(celluleDef, type);
    }

    /**
     * Contenu de la cellule à afficher dans le template
     */
    get contenu(): KfComposant {
        return this.pContenu;
    }

    fixeTexte(texte: string) {
        this.pContenu.fixeTexte(texte);
    }

    /**
     * Undefined si le  contenu de la cellule n'est pas du texte
     */
    get kfTexte(): KfTexte {
        return this.pContenu.type === KfTypeDeComposant.texte ? this.pContenu as KfTexte : undefined;
    }

    /**
     * Vrai si le  contenu de la cellule est du texte
     */
    get estTexte(): boolean {
        return this.pContenu.type === KfTypeDeComposant.texte;
    }

    /**
     * Gére le comportement de l'élément td de la cellule.
     */
    get géreHtml(): KfComposantGereHtml {
        return this.pGéreHtml;
    }

    initialiseHtml(td: HTMLTableCellElement) {
        this.pGéreHtml.htmlElement = td;
        this.pGéreHtml.initialiseHtml();
        this.pGéreHtml.parent = this.pLigne.géreHtml;
    }

}
