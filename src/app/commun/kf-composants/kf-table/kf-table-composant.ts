import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

export interface IKfTableCellule {
    /**
     * Si présent et vrai, affichage dans un th. Sinon, affichage dans un td.
     */
    enTete?: boolean;
    texte?: string;
    composant?: KfComposant;
    géreCss?: KfGéreCss;
}
export interface IKfTableLigne {
    cellules: IKfTableCellule[];
    géreCss?: KfGéreCss;
}
export class KfTable extends KfComposant {
    enTete: IKfTableLigne;
    corps: IKfTableLigne[];
    private pGereCssEnTete: KfGéreCss;
    private pGereCssCorps: KfGéreCss;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.table);
    }

    get gereCssEnTete(): KfGéreCss {
        if (!this.pGereCssEnTete) {
            this.pGereCssEnTete = new KfGéreCss();
        }
        return this.pGereCssEnTete;
    }

    get classeEnTete(): KfNgClasse {
        if (this.pGereCssEnTete) {
            return this.pGereCssEnTete.classe;
        }
    }

    get styleEnTete(): KfNgStyle {
        if (this.pGereCssEnTete) {
            return this.pGereCssEnTete.style;
        }
    }

    get gereCssCorps(): KfGéreCss {
        if (!this.pGereCssCorps) {
            this.pGereCssCorps = new KfGéreCss();
        }
        return this.pGereCssCorps;
    }

    get classeCorps(): KfNgClasse {
        if (this.pGereCssCorps) {
            return this.pGereCssCorps.classe;
        }
    }

    get styleCorps(): KfNgStyle {
        if (this.pGereCssCorps) {
            return this.pGereCssCorps.style;
        }
    }

    classeLigne(ligne: IKfTableLigne): KfNgClasse {
        if (ligne.géreCss) {
            return ligne.géreCss.classe;
        }
    }

    styleLigne(ligne: IKfTableLigne): KfNgStyle {
        if (ligne.géreCss) {
            return ligne.géreCss.style;
        }
    }

    classeCellule(cellule: IKfTableCellule): KfNgClasse {
        if (cellule.géreCss) {
            return cellule.géreCss.classe;
        }
    }

    styleCellule(cellule: IKfTableCellule): KfNgStyle {
        if (cellule.géreCss) {
            return cellule.géreCss.style;
        }
    }

    thScope(cellule: IKfTableCellule, ligne: IKfTableLigne): string {
        return ligne === this.enTete ? 'col' : cellule.enTete ? 'row' : undefined;
    }

}
