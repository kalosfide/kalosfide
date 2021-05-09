import { KfComposantGereHtml } from "../kf-composant/kf-composant-gere-html";
import { KfGéreCss } from "../kf-partages/kf-gere-css";
import { KfNgClasse } from "../kf-partages/kf-gere-css-classe";
import { KfNgStyle } from "../kf-partages/kf-gere-css-style";
import { KfVueTable } from "./kf-vue-table";
import { IKfVueTableLigne, KfVueTableLigneBase } from "./kf-vue-table-ligne-base";

export interface IKfVueTableSection {
    classe: KfNgClasse;
    style: KfNgStyle;
    lignes: IKfVueTableLigne[];
    lignesVisibles: IKfVueTableLigne[];
    géreHtml: KfComposantGereHtml;
}

export abstract class KfVueTableSectionBase<T> implements IKfVueTableSection {
    protected pLignes: KfVueTableLigneBase<T>[];
    protected pVueTable: KfVueTable<T>;

    /**
     * Gére classe et style de l'élément thead, tbody ou tfoot
     * Est créé par lecture. N'est plus undefined dès que lu.
     */
    protected pGereCss: KfGéreCss;

    /**
     * Gére le comportement de l'élément tr de la ligne.
     */
    protected pGéreHtml: KfComposantGereHtml;

    constructor(vueTable: KfVueTable<T>) {
        this.pVueTable = vueTable;
        this.pGéreHtml = new KfComposantGereHtml();
        vueTable.gereHtml.ajouteEnfant(this.pGéreHtml);
    }

    /**
     * KfVueTable contenant la section en-tête, corps ou bilan.
     */
    get vueTable(): KfVueTable<T> {
        return this.pVueTable;
    }

    /**
     * Gére classe et style de l'élément thead, tbody ou tfoot
     * Est créé par lecture. N'est plus undefined dès que lu.
     */
    get gereCss(): KfGéreCss {
        if (!this.pGereCss) {
            this.pGereCss = new KfGéreCss();
        }
        return this.pGereCss;
    }

    /**
     * NgClasse de l'élément thead, tbody ou  tfoot.
     */
    get classe(): KfNgClasse {
        if (this.pGereCss) {
            return this.pGereCss.classe;
        }
    }

    /**
     * NgStyle de l'élément thead, tbody ou  tfoot.
     */
    get style(): KfNgStyle {
        if (this.pGereCss) {
            return this.pGereCss.style;
        }
    }

    abstract get lignes(): IKfVueTableLigne[];

    abstract get lignesVisibles(): IKfVueTableLigne[];

    get géreHtml(): KfComposantGereHtml {
        return this.pGéreHtml;
    }

    protected initialiseHtmlLignes(): boolean {
        let changé = false;
        if (this.lignesVisibles) {
            const trs = this.pGéreHtml.htmlElement.children;
            for (let index = 0; index < this.lignesVisibles.length; index++) {
                const tr = trs[index] as HTMLTableRowElement;
                const ligne = this.lignesVisibles[index];
                if (ligne.géreHtml.htmlElement !== tr) {
                    ligne.initialiseHtml(tr);
                    changé = true;
                }
            }
        }
        return changé;
    }

    initialiseHtml(tsection: HTMLElement) {
        this.pGéreHtml.htmlElement = tsection;
        this.pGéreHtml.initialiseHtml();
        this.initialiseHtmlLignes();
        this.pGéreHtml.parent = this.vueTable.gereHtml;
    }

    vérifieHtml(): boolean {
        return this.initialiseHtmlLignes();
    }
}