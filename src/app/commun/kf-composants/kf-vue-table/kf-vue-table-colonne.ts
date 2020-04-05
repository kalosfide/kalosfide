import { KfComposant } from '../kf-composant/kf-composant';
import { Tri } from '../../outils/tri';
import { KfVueTableCelluleDef } from './kf-vue-table-cellule';
import { KfVueTable, IKfVueTable } from './kf-vue-table';
import { KfNgClasseDef, KfNgClasse, KfNgClasseDefDe } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfGéreCssDe } from '../kf-partages/kf-gere-css-de-t';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';

export interface IKfVueTableColonne {
    index: number;
    nom: string;
    vueTable: IKfVueTable;
    nePasAfficher: boolean;
}

export class KfVueTableColonne<T> implements IKfVueTableColonne {

    private pVueTable: KfVueTable<T>;
    private pIndex: number;
    private pColonneDef: IKfVueTableColonneDef<T>;
    private pGereCssEntete: KfGéreCss;
    private pGereCssItem: KfGéreCssDe<T>;
    private pGereCssBilan: KfGéreCss;

    nePasAfficher: boolean;

    constructor(vueTable: KfVueTable<T>, colonneDef: IKfVueTableColonneDef<T>, index: number) {
        this.pVueTable = vueTable;
        this.pColonneDef = colonneDef;
        this.pIndex = index;
        if (colonneDef.nePasAfficherSi) {
            this.nePasAfficher = colonneDef.nePasAfficherSi.valeur;
        } else {
            if (colonneDef.afficherSi) {
                this.nePasAfficher = !colonneDef.afficherSi.valeur;
            }
        }
        if (colonneDef.enTeteDef && colonneDef.enTeteDef.classeDefs) {
            this.pGereCssEntete = new KfGéreCss();
            this.pGereCssEntete.ajouteClasseDefArray(colonneDef.enTeteDef.classeDefs);
        }
        if (colonneDef.classeDefs) {
            this.ajouteClasseItemArray(colonneDef.classeDefs);
        }
        if (colonneDef.bilanDef && colonneDef.bilanDef.classeDefs) {
            this.pGereCssBilan = new KfGéreCss();
            this.pGereCssBilan.ajouteClasseDefArray(colonneDef.bilanDef.classeDefs);
        }
    }

    get vueTable(): KfVueTable<T> { return this.pVueTable; }

    get index(): number { return this.pIndex; }

    get nom(): string { return this.pColonneDef.nom; }

    /**
     * texte ou composant à afficher dans la ligne d'en-tête
     */
    get enTeteDef(): IKfVueTableEnTeteDef { return this.pColonneDef.enTeteDef; }

    /**
     * tri associè à la colonne
     */
    get tri(): Tri<T> { return this.pColonneDef.tri; }

    /**
     * afficherSi du tri associè à la colonne
     */
    get afficherTriSi(): KfInitialObservable<boolean> { return this.pColonneDef.afficherTriSi; }

    /**
     * nePasAfficherSi du tri associè à la colonne
     */
    get nePasAfficherTriSi(): KfInitialObservable<boolean> { return this.pColonneDef.nePasAfficherTriSi; }

    /**
     * texte ou composant à afficher dans l'élément td associèe à l'item
     */
    get créeContenu(): (item: T) => KfVueTableCelluleDef { return this.pColonneDef.créeContenu; }

    /**
     * classe à appliquer à l'élément td associèe à l'item
     */
    get classes(): (string | ((t: T) => string) | KfNgClasseDefDe<T>)[] { return this.pColonneDef.classeDefs; }

    /**
     * texte ou composant à afficher dans la ligne de bilan
     */
    get bilanDef(): IKfVueTableBilanDef<T> { return this.pColonneDef.bilanDef; }

    /**
     * classe à ajouter à l'élément th de l'en-tête
     */
    ajouteClasseEntete(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGereCssEntete) {
            this.pGereCssEntete = new KfGéreCss();
        }
        this.pGereCssEntete.ajouteClasseDefArray(classeDefs);
    }

    get classeEntete(): KfNgClasse {
        if (this.pGereCssEntete) {
            return this.pGereCssEntete.classe;
        }
    }

    /**
     * classe à ajouter à l'élément td de l'item
     */
    ajouteClasseItemArray(classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        if (!this.pGereCssItem) {
            this.pGereCssItem = new KfGéreCssDe<T>();
        }
        this.pGereCssItem.ajouteClasseDefArray(classeDefs);
    }
    ajouteClasseItem(...classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        this.ajouteClasseItemArray(classeDefs);
    }

    classeItem(t: T): KfNgClasse {
        if (this.pGereCssItem) {
            return this.pGereCssItem.classe(t);
        }
    }

    /**
     * classe à ajouter à l'élément th du bilan
     */
    ajouteClasseBilan(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this.pGereCssBilan) {
            this.pGereCssBilan = new KfGéreCss();
        }
        this.pGereCssBilan.ajouteClasseDefArray(classeDefs);
    }

    get classeBilan(): KfNgClasse {
        if (this.pGereCssBilan) {
            return this.pGereCssBilan.classe;
        }
    }
}
