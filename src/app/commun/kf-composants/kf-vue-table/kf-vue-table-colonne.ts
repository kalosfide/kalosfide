import { KfVueTable, IKfVueTable } from './kf-vue-table';
import { KfNgClasseDef, KfNgClasse, KfNgClasseDefDe } from '../kf-partages/kf-gere-css-classe';
import { KfStringDef } from '../kf-partages/kf-string-def';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfGéreCssDe } from '../kf-partages/kf-gere-css-de-t';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';
import { ValeurEtObservable } from '../../outils/valeur-et-observable';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { Compare, Tri } from '../../outils/tri';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';
import { IKfVueTableColonneNoLigneDef } from './i-kf-vue-table-colonne-no-ligne-def';
import { KfVueTableCellule } from './kf-vue-table-cellule';

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
    private pGéreCssEnteteTh: KfGéreCss;
    private pGéreCssEnteteDiv: KfGéreCss;

    /**
     * Gére les classes à ajouter à l'élément td associèe à un item
     */
    private pGéreCssItem: KfGéreCssDe<T>;
    private pGéreCssItemDiv: KfGéreCss;

    private pGéreCssBilan: KfGéreCss;

    private pGéreCssCol: KfGéreCss;

    protected pTri: Tri;

    nePasAfficher: boolean;
    nePasAfficherSi: ValeurEtObservable<boolean>;

    constructor(vueTable: KfVueTable<T>, colonneDef: IKfVueTableColonneDef<T>, index: number) {
        this.pVueTable = vueTable;
        this.pColonneDef = colonneDef;
        this.pIndex = index;
        if (colonneDef.nePasAfficherSi) {
            this.nePasAfficher = colonneDef.nePasAfficherSi.valeur;
            this.nePasAfficherSi = colonneDef.nePasAfficherSi;
        } else {
            if (colonneDef.afficherSi) {
                this.nePasAfficher = !colonneDef.afficherSi.valeur;
                this.nePasAfficherSi = ValeurEtObservable.non(colonneDef.afficherSi);
            }
        }
        if (colonneDef.classesCol) {
            this.ajouteClasseCol(...colonneDef.classesCol);
        }
        if (colonneDef.enTeteDef) {
            if (colonneDef.enTeteDef.classesTh) {
                this.ajouteClasseEnteteTh(...colonneDef.enTeteDef.classesTh);
            }
            if (colonneDef.enTeteDef.classesDiv) {
                this.ajouteClasseEnteteDiv(...colonneDef.enTeteDef.classesDiv);
            }
            if (this.nePasAfficherSi) {
                this.ajouteClasseEnteteTh({ nom: 'kf-invisible', active: () => this.nePasAfficherSi.valeur });
            }
        }
        if (colonneDef.classesTd) {
            this.ajouteClasseItem(...colonneDef.classesTd);
        }
        if (colonneDef.classesDiv) {
            this.ajouteClasseItemDiv(...colonneDef.classesDiv);
        }
        if (this.nePasAfficherSi) {
            this.ajouteClasseItem({ nom: 'kf-invisible', active: () => this.nePasAfficherSi.valeur });
        }
        if (colonneDef.bilanDef) {
            if (colonneDef.bilanDef.classeDefs) {
                this.ajouteClasseBilan(...colonneDef.bilanDef.classeDefs);
            }
            if (this.nePasAfficherSi) {
                this.ajouteClasseBilan({ nom: 'kf-invisible', active: () => this.nePasAfficherSi.valeur });
            }
        }
        if (colonneDef.compare) {
            this.pTri = new Tri((l1: KfVueTableLigne<T>, l2: KfVueTableLigne<T>) => colonneDef.compare(l1.item, l2.item));
            this.ajouteClasseEnteteTh('kf-vue-table-tri');
        }
    }

    get vueTable(): KfVueTable<T> { return this.pVueTable; }

    get index(): number { return this.pIndex; }

    get nom(): string { return this.pColonneDef.nom; }

    get largeur(): string {
        return this.pColonneDef.largeur;
    }

    /**
     * texte ou composant à afficher dans la ligne d'en-tête
     */
    get enTeteDef(): IKfVueTableEnTeteDef { return this.pColonneDef.enTeteDef; }

    /**
     * tri associé à la colonne
     */
    get tri(): Tri { return this.pTri; }

    /**
     * nePasAfficherSi du tri associè à la colonne
     */
    get nePasAfficherTriSi(): ValeurEtObservable<boolean> { return this.pColonneDef.nePasAfficherTriSi; }

    /**
     * texte ou composant à afficher dans l'élément td associèe à l'item
     */
    get créeContenu(): (item: T) => KfVueTableCelluleDef { return this.pColonneDef.créeContenu; }

    get quandItemModifié(): 'rafraichit' | ((cellule: KfVueTableCellule<T>) => void) { return this.pColonneDef.quandItemModifié; }

    /**
     * texte ou composant à afficher dans la ligne de bilan
     */
    get bilanDef(): IKfVueTableBilanDef<T> { return this.pColonneDef.bilanDef; }

    /**
     * Ajoute des classes à l'élément col du colgroup.
     */
    ajouteClasseCol(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssCol) {
            this.pGéreCssCol = new KfGéreCss();
        }
        this.pGéreCssCol.ajouteClasse(...classeDefs);
    }

    /**
     * Supprime des classes de l'élément col du colgroup.
     */
    supprimeClasseCol(...classeDefs: KfStringDef[]) {
        if (this.pGéreCssCol) {
            this.pGéreCssCol.supprimeClasse(...classeDefs);
        }
    }

    /**
     * KfNgClasse de l'élément col du colgroup.
     */
    get classeCol(): KfNgClasse {
        if (this.pGéreCssCol) {
            return this.pGéreCssCol.classe;
        }
    }

    /**
     * Ajoute des classes à l'élément th de l'en-tête.
     */
    ajouteClasseEnteteTh(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssEnteteTh) {
            this.pGéreCssEnteteTh = new KfGéreCss();
        }
        this.pGéreCssEnteteTh.ajouteClasse(...classeDefs);
    }

    /**
     * Supprime des classes de l'élément th de l'en-tête.
     */
    supprimeClasseEnteteTh(...classeDefs: KfStringDef[]) {
        if (this.pGéreCssEnteteTh) {
            this.pGéreCssEnteteTh.supprimeClasse(...classeDefs);
        }
    }

    /**
     * KfNgClasse de l'élément th de l'en-tête.
     */
    get classeEnteteTh(): KfNgClasse {
        if (this.pGéreCssEnteteTh) {
            return this.pGéreCssEnteteTh.classe;
        }
    }

    /**
     * Ajoute des classes à un élément div ajouté autour du contenu de l'en-tête.
     */
     ajouteClasseEnteteDiv(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssEnteteDiv) {
            this.pGéreCssEnteteDiv = new KfGéreCss();
        }
        this.pGéreCssEnteteDiv.ajouteClasse(...classeDefs);
    }

    /**
     * Supprime des classes de l'élément div ajouté autour du contenu de l'en-tête s'il existe.
     */
    supprimeClasseEnteteDiv(...classeDefs: KfStringDef[]) {
        if (this.pGéreCssEnteteDiv) {
            this.pGéreCssEnteteDiv.supprimeClasse(...classeDefs);
        }
    }

    /**
     * KfNgClasse de l'élément div ajouté autour du contenu de l'en-tête s'il existe.
     */
    get classeEnteteDiv(): KfNgClasse {
        if (this.pGéreCssEnteteDiv)  {
            return this.pGéreCssEnteteDiv.classe;
        }
    }

    /**
     * Ajoute des classes à l'élément td de l'item
     */
    ajouteClasseItem(...classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        if (!this.pGéreCssItem) {
            this.pGéreCssItem = new KfGéreCssDe<T>();
        }
        this.pGéreCssItem.ajouteClasse(...classeDefs);
    }

    /**
     * Supprime des classes de l'élément td de l'item
     */
    supprimeClasseItem(...classeDefs: KfStringDef[]) {
        if (this.pGéreCssItem) {
            this.pGéreCssItem.supprimeClasse(...classeDefs);
        }
    }

    /**
     * KfNgClasse de l'élément td de l'item.
     */
    classeItem(t: T): KfNgClasse {
        if (this.pGéreCssItem) {
            return this.pGéreCssItem.classe(t);
        }
    }

    /**
     * Ajoute des classes à un élément div ajouté autour du contenu de l'en-tête.
     */
     ajouteClasseItemDiv(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssItemDiv) {
            this.pGéreCssItemDiv = new KfGéreCss();
        }
        this.pGéreCssItemDiv.ajouteClasse(...classeDefs);
    }

    /**
     * Supprime des classes de l'élément div ajouté autour du contenu de l'en-tête s'il existe.
     */
    supprimeClasseItemDiv(...classeDefs: KfStringDef[]) {
        if (this.pGéreCssItemDiv) {
            this.pGéreCssItemDiv.supprimeClasse(...classeDefs);
        }
    }

    /**
     * KfNgClasse de l'élément div ajouté autour du contenu de l'en-tête s'il existe.
     */
    get classeItemDiv(): KfNgClasse {
        if (this.pGéreCssItemDiv)  {
            return this.pGéreCssItemDiv.classe;
        }
    }

    /**
     * Ajoute des classes à l'élément th du bilan
     */
    ajouteClasseBilan(...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        if (!this.pGéreCssBilan) {
            this.pGéreCssBilan = new KfGéreCss();
        }
        this.pGéreCssBilan.ajouteClasse(...classeDefs);
    }

    /**
     * Supprime des classes de l'élément th du bilan
     */
    supprimeClasseBilan(...classeDefs: KfStringDef[]) {
        if (this.pGéreCssBilan) {
            this.pGéreCssBilan.supprimeClasse(...classeDefs);
        }
    }

    /**
     * KfNgClasse de l'élément th du bilan
     */
    get classeBilan(): KfNgClasse {
        if (this.pGéreCssBilan) {
            return this.pGéreCssBilan.classe;
        }
    }
}

export class KfVueTableColonneNuméro<T> extends KfVueTableColonne<T> {
    private pLargeur: string;

    constructor(vueTable: KfVueTable<T>, colonneNoLigneDef: IKfVueTableColonneNoLigneDef) {
        super(vueTable, {
            nom: 'no',
            enTeteDef: {
                titreDef: colonneNoLigneDef.texteEnTete ? colonneNoLigneDef.texteEnTete : '#',
                classesTh: colonneNoLigneDef.classeDefsEnTete
            },
            créeContenu: null,
            classesTd: colonneNoLigneDef.classeDefs
        }, 0);
        if (colonneNoLigneDef.avecTri) {
            this.pTri = new Tri((l1: KfVueTableLigne<T>, l2: KfVueTableLigne<T>) => Compare.nombre(l => l.index)(l1, l2));
        }
        this.pLargeur = colonneNoLigneDef.largeur;
    }

    get largeur(): string {
        return this.pLargeur;
    }
}
