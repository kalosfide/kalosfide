import { KfComposant } from '../kf-composant/kf-composant';
import { KfVueTableColonne, IKfVueTableColonne } from './kf-vue-table-colonne';
import { KfVueTable } from './kf-vue-table';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';

export interface IKfVueTableCelluleDef {
    texteDef?: () => string;
    composant?: KfComposant;
}

export type KfVueTableCelluleDef = string | IKfVueTableCelluleDef;

export interface IKfVueTableCellule {
    colonne: IKfVueTableColonne;
    composant: KfComposant;
    classe?: KfNgClasse;
    colSpan?: number;
    rowSpan?: number;
}

export abstract class KfVueTableCelluleBase<T> {
    protected pVueTable: KfVueTable<T>;
    protected pColonne: KfVueTableColonne<T>;
    protected pIndex: number;
    protected pComposant: KfComposant;

    protected pColSpan: number | (() => number);
    private pRowSpan: number;
    protected pNePasAfficher: boolean | (() => boolean);

    thScope: string;

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>, index: number) {
        this.pVueTable = vueTable;
        this.pColonne = colonne;
        this.pIndex = index;
    }

    get vueTable(): KfVueTable<T> {
        return this.pVueTable;
    }

    get colonne(): KfVueTableColonne<T> {
        return this.pColonne;
    }

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

    protected créeComposant(celluleDef: KfVueTableCelluleDef): KfComposant {
        let texteDef: KfTexteDef;
        if (!celluleDef) {
            texteDef = '';
        } else {
            if (typeof (celluleDef) === 'string') {
                texteDef = celluleDef;
            } else {
                if (celluleDef.composant !== undefined) {
                    return celluleDef.composant;
                } else {
                    texteDef = celluleDef.texteDef !== undefined ? celluleDef.texteDef : '';
                }
            }
        }
        return new KfEtiquette('e' + (this.pIndex + 1), texteDef);
    }

    get composant(): KfComposant {
        return this.pComposant;
    }

}

export class KfVueTableCellule<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {
    item: T;

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>, index: number, item: T) {
        super(vueTable, colonne, index);
        this.item = item;
        this.pComposant = this.créeComposant(this.pColonne.créeContenu(this.item));
    }

    get classe(): KfNgClasse {
        return this.pColonne.classeItem(this.item);
    }
}

export class KfVueTableCelluleBilan<T> extends KfVueTableCelluleBase<T> implements IKfVueTableCellule {

    constructor(vueTable: KfVueTable<T>, colonne: KfVueTableColonne<T>, ligneDesVisibles?: boolean) {
        super(vueTable, colonne, colonne.index);
        this.initialise(ligneDesVisibles);
        this.thScope = 'col';
    }

    initialise(ligneDesVisibles: boolean) {
        const bilanDef = this.pColonne.bilanDef;
        if (bilanDef) {
            // c'est une cellule avec bilan
            this.pComposant = this.créeComposant(bilanDef.valeurDef ? bilanDef.valeurDef : '');
            this.pNePasAfficher = () => this.pColonne.nePasAfficher;
            let texteDef: () => string;
            if (bilanDef.texteAgrégé) {
                const etiquette = this.pComposant as KfEtiquette;
                if (ligneDesVisibles) {
                    texteDef = () => bilanDef.texteAgrégé(this.vueTable.lignes.filter(l => l.passeFiltres).map(l => l.item));
                } else {
                    texteDef = () => bilanDef.texteAgrégé(this.vueTable.lignes.map(l => l.item));
                }
                etiquette.fixeTexte(texteDef);
            }
        } else {
            const colonnes = this.vueTable.colonnes;
            const index = this.pColonne.index;
            const colonneAvecBilanSuivante = colonnes.slice(index + 1).find(c => c.bilanDef !== undefined && c.bilanDef !== null);
            if (colonneAvecBilanSuivante === undefined) {
                // les cellules qui suivent la dernière cellule de bilan sont affichèes si leur colonne l'est
                this.pComposant = this.créeComposant('');
                this.nePasAfficher = this.pColonne.nePasAfficher;
            } else {
                if (colonneAvecBilanSuivante.index === index + 1) {
                    // une cellule qui précède une cellule de bilan qui a un titre s'étale sur toutes les colonnes
                    // affichées qui suivent la cellule de bilan précédente
                    const bilanSuivant = colonneAvecBilanSuivante.bilanDef;
                    const titre = ligneDesVisibles && bilanSuivant.titreVisiblesSeulement
                        ? bilanSuivant.titreVisiblesSeulement
                        : bilanSuivant.titreDef
                            ? bilanSuivant.titreDef
                            : '';
                    this.pComposant = this.créeComposant(titre);
                    this.pColSpan = () => {
                        let colSpan = this.pColonne.nePasAfficher ? 0 : 1;
                        for (let i = index - 1; i >= 0; i--) {
                            const colonne = this.vueTable.colonnes[i];
                            if (!colonne.nePasAfficher) {
                                if (colonne.bilanDef) {
                                    break;
                                } else {
                                    colSpan++;
                                }
                            }
                        }
                        return colSpan;
                    };
                    this.pNePasAfficher = () => colonneAvecBilanSuivante.nePasAfficher;
                } else {
                    this.pComposant = this.créeComposant('');
                    this.nePasAfficher = true;
                }
            }
        }
    }

    get classe(): KfNgClasse {
        return this.pColonne.classeBilan;
    }
}
