import { KfComposant } from '../kf-composant/kf-composant';
import {
    KfVueTableCellule, KfVueTableCelluleBase, KfVueTableCelluleBilan, IKfVueTableCellule
} from './kf-vue-table-cellule';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { FormGroup } from '@angular/forms';
import { KfVueTable } from './kf-vue-table';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

/** pour que le component soit indépendant du générique T */
export interface IKfVueTableLigne {
    cellules: IKfVueTableCellule[];
    passeFiltres?: boolean;
    formGroup?: FormGroup;
    id?: string;
}

export abstract class KfVueTableLigneBase<T> {
    protected pVueTable: KfVueTable<T>;
    protected pCellules: KfVueTableCelluleBase<T>[];
    protected pGereCss: KfGéreCss;

    constructor(vueTable: KfVueTable<T>) {
        this.pVueTable = vueTable;
    }

    get vueTable(): KfVueTable<T> {
        return this.pVueTable;
    }

    public get cellules(): IKfVueTableCellule[] {
        const cellulesVisibles = this.pCellules.filter(cellule => !cellule.nePasAfficher);
        return cellulesVisibles;
    }

    public get composants(): KfComposant[] {
        return this.pCellules.map(cellule => cellule.composant).filter(composant => !!composant);
    }

    get géreCss(): KfGéreCss {
        return this.pGereCss;
    }

    get classe(): KfNgClasse {
        if (this.pGereCss) {
            return this.pGereCss.classe;
        }
    }
    get style(): KfNgStyle {
        if (this.pGereCss) {
            return this.pGereCss.style;
        }
    }
}

export class KfVueTableLigne<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {
    private pIndex: number;
    private pItem: T;
    private pId: string;
    private pSuperGroupe: KfSuperGroupe;
    passeFiltres: boolean;

    constructor(vueTable: KfVueTable<T>, item: T, index: number) {
        super(vueTable);
        if (vueTable.superGroupe) {
            this.pSuperGroupe = vueTable.superGroupe(item);
            this.pSuperGroupe.listeParent = vueTable;
        }
        this.pItem = item;
        this.pIndex = index;
        this.pCellules = vueTable.colonnes.map(colonne => new KfVueTableCellule<T>(vueTable, colonne, index, item));
        if (vueTable.avecEnTêtesDeLigne) {
            this.pCellules[0].thScope = 'row';
        }
        this.passeFiltres = true;
        if (vueTable.id) {
            this.pId = vueTable.id(item);
        }
        if (vueTable.gereCss) {
            this.pGereCss = vueTable.gereCss(item);
        } else {
            if (vueTable.fixeChoisie || vueTable.avecClic) {
                this.pGereCss = new KfGéreCss();
            }
        }
        if (vueTable.avecClic) {
            this.pGereCss.ajouteClasseDef('kf-bouton');
        }
    }

    get choisie(): boolean {
        return this.pIndex === this.vueTable.index;
    }

    public get index(): number {
        return this.pIndex;
    }

    public get item(): T {
        return this.pItem;
    }

    get id(): string {
        return this.pId;
    }

    public get superGroupe(): KfSuperGroupe {
        return this.pSuperGroupe;
    }

    public get formGroup(): FormGroup {
        return this.pSuperGroupe.formGroup;
    }

    public get composantsAValider(): KfComposant[] {
        return this.pVueTable.composantsAValider(this.pItem);
    }
}

export class KfVueTableBilan<T> extends KfVueTableLigneBase<T> implements IKfVueTableLigne {

    constructor(vueTable: KfVueTable<T>, ligneDesVisibles?: boolean) {
        super(vueTable);
        this.pCellules = vueTable.colonnes.map(colonne => new KfVueTableCelluleBilan<T>(vueTable, colonne, ligneDesVisibles));
    }

}
