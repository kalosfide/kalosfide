import { KfVueTableCellule } from './kf-vue-table-cellule';
import { KfVueTableCelluleBase, IKfVueTableCellule } from './kf-vue-table-cellule-base';
import { FormGroup } from '@angular/forms';
import { KfVueTable } from './kf-vue-table';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';
import { KfComposantGereHtml } from '../kf-composant/kf-composant-gere-html';
import { KfVueTableSectionBase } from './kf-vue-table-section-base';
import { EventEmitter } from '@angular/core';
import { KfEvenement } from '../kf-partages/kf-evenements';

/** pour que le component soit indépendant du générique T */
export interface IKfVueTableLigne {
    cellulesVisibles: IKfVueTableCellule[];
    formGroup?: FormGroup;
    id?: string;
    nom: string;
    classe: KfNgClasse;
    style: KfNgStyle;
    nbColonnesVisibles: number;
    erreurs?: string[];
    géreHtml: KfComposantGereHtml;
    initialiseHtml(tr: HTMLTableRowElement): void;
}

export abstract class KfVueTableLigneBase<T> {
    /**
     * KfVueTableSectionBase contenant la ligne.
     */
    protected pSection: KfVueTableSectionBase<T>;

    /**
     * Liste de toutes les cellules de la ligne.
     */
    protected pCellules: KfVueTableCelluleBase<T>[];

    /** 
     * Gére classes et styles de l'élément tr de la ligne.
     * Créé à la première lecture.
    */
    protected pGéreCss: KfGéreCss;

    /**
     * Gére le comportement de l'élément tr de la ligne.
     */
    protected pGéreHtml: KfComposantGereHtml;

    /**
     * @param section KfVueTableSectionBase contenant la ligne
     */
    constructor(section: KfVueTableSectionBase<T>) {
        this.pSection = section;
        this.pGéreHtml = new KfComposantGereHtml();
        section.géreHtml.ajouteEnfant(this.pGéreHtml);
    }

    /**
     * KfVueTable contenant la ligne.
     */
    get vueTable(): KfVueTable<T> {
        return this.pSection.vueTable;
    }

    abstract get nom(): string;

    get nbColonnesVisibles(): number {
        return this.pSection.vueTable.nbColonnesVisibles;
    }

    /**
     * Liste de toutes les cellules de la ligne.
     */
    public get cellules(): IKfVueTableCellule[] {
        return this.pCellules;
    }

    /**
     * Liste des cellules à afficher de la ligne.
     */
    public get cellulesVisibles(): IKfVueTableCellule[] {
        const cellulesVisibles = this.pCellules.filter(cellule => !cellule.colonne.nePasAfficher);
        return cellulesVisibles;
    }

    /** 
     * Gére classes et styles de l'élément tr de la ligne.
     * Créé à la première lecture.
    */
    public get géreCss(): KfGéreCss {
        if (!this.pGéreCss) {
            this.pGéreCss = new KfGéreCss();
        }
        return this.pGéreCss;
    }
    /** 
     * Retourne la KfNgClasse de l'élément tr de la ligne.
    */
    public get classe(): KfNgClasse {
        if (this.pGéreCss) {
            return this.pGéreCss.classe;
        }
    }
    /** 
     * Retourne le KfNgStyle de l'élément tr de la ligne.
    */
    public get style(): KfNgStyle {
        if (this.pGéreCss) {
            return this.pGéreCss.style;
        }
    }

    get géreHtml(): KfComposantGereHtml {
        return this.pGéreHtml;
    }

    protected initialiseHtmlCellules(tr: HTMLTableRowElement) {
        const cells = tr.cells;
        const cellulesVisibles = this.pCellules.filter(cellule => !cellule.colonne.nePasAfficher);
        for (let index = 0; index < cellulesVisibles.length; index++) {
            const cell = cells[index];
            const cellule = cellulesVisibles[index];
            cellule.initialiseHtml(cell);
        }
    }
    public initialiseHtml(tr: HTMLTableRowElement) {
        this.pGéreHtml.htmlElement = tr;
        this.pGéreHtml.initialiseHtml();
        this.initialiseHtmlCellules(tr);
        this.pGéreHtml.parent = this.pSection.géreHtml;
    }

}
