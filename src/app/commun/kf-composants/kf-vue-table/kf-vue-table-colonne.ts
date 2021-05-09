import { KfVueTable, IKfVueTable } from './kf-vue-table';
import { KfNgClasseDef, KfNgClasse, KfNgClasseDefDe } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfGéreCssDe } from '../kf-partages/kf-gere-css-de-t';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { Compare, Tri } from '../../outils/tri';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';
import { IKfVueTableColonneNoLigneDef } from './i-kf-vue-table-colonne-no-ligne-def';

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
    /**
     * Gére les classes à ajouter à l'élément td associèe à un item
     */
    private pGereCssItem: KfGéreCssDe<T>;
    private pGereCssBilan: KfGéreCss;

    protected pTri: Tri;

    nePasAfficher: boolean;
    nePasAfficherSi: KfInitialObservable<boolean>;

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
                this.nePasAfficherSi = KfInitialObservable.non(colonneDef.afficherSi);
            }
        }
        if (colonneDef.enTeteDef) {
            if (colonneDef.enTeteDef.classeDefs) {
                this.ajouteClasseEntete(...colonneDef.enTeteDef.classeDefs);
            }
            if (this.nePasAfficherSi) {
                this.ajouteClasseEntete({ nom: 'kf-invisible', active: () => this.nePasAfficherSi.valeur });
            }
        }
        if (colonneDef.classeDefs) {
            this.ajouteClasseItem(...colonneDef.classeDefs);
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
            this.ajouteClasseEntete('kf-vue-table-tri');
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
     * tri associé à la colonne
     */
    get tri(): Tri { return this.pTri; }

    /**
     * nePasAfficherSi du tri associè à la colonne
     */
    get nePasAfficherTriSi(): KfInitialObservable<boolean> { return this.pColonneDef.nePasAfficherTriSi; }

    /**
     * texte ou composant à afficher dans l'élément td associèe à l'item
     */
    get créeContenu(): (item: T) => KfVueTableCelluleDef { return this.pColonneDef.créeContenu; }

    /**
     * Liste des définitions de classes à ajouter à l'élément td associèe à un item
     */
    get classeDefsItem(): (string | ((t: T) => string) | KfNgClasseDefDe<T>)[] { return this.pColonneDef.classeDefs; }

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
        this.pGereCssEntete.ajouteClasse(...classeDefs);
    }

    get classeEntete(): KfNgClasse {
        if (this.pGereCssEntete) {
            return this.pGereCssEntete.classe;
        }
    }

    /**
     * classe à ajouter à l'élément td de l'item
     */
    ajouteClasseItem(...classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        if (!this.pGereCssItem) {
            this.pGereCssItem = new KfGéreCssDe<T>();
        }
        this.pGereCssItem.ajouteClasseDef(...classeDefs);
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
        this.pGereCssBilan.ajouteClasse(...classeDefs);
    }

    get classeBilan(): KfNgClasse {
        if (this.pGereCssBilan) {
            return this.pGereCssBilan.classe;
        }
    }
}

export class KfVueTableColonneNuméro<T> extends KfVueTableColonne<T> {
    constructor(vueTable: KfVueTable<T>, colonneNoLigneDef: IKfVueTableColonneNoLigneDef) {
        super(vueTable, {
            nom: 'no',
            enTeteDef: {
                titreDef: colonneNoLigneDef.texteEnTete ? colonneNoLigneDef.texteEnTete : '#',
                classeDefs: colonneNoLigneDef.classeDefsEnTete
            },
            créeContenu: null,
            classeDefs: colonneNoLigneDef.classeDefs
        }, 0);
        if (colonneNoLigneDef.avecTri) {
            this.pTri = new Tri((l1: KfVueTableLigne<T>, l2: KfVueTableLigne<T>) => Compare.nombre(l => l.index)(l1, l2));
        }
    }
}
