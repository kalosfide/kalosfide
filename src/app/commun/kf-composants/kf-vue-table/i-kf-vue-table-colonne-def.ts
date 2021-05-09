import { KfNgClasseDefDe } from '../kf-partages/kf-gere-css-classe';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';

export interface IKfVueTableColonneDef<T> {
    nom: string;

    /**
     * texte ou composant à afficher dans la ligne d'en-tête
     */
    enTeteDef?: IKfVueTableEnTeteDef;

    /**
     * texte ou composant à afficher dans l'élément td associèe à l'item
     */
    créeContenu: (item: T) => KfVueTableCelluleDef;

    /**
     * Retourne -1 si t1 est avant t2, 1 si t1 est après t2, 0 sinon
     * Présent pour associer un tri à la colonne
     */
    compare?: (t1: T, t2: T) => number;

    /**
     * valeur initiale et Observable définissant si le déclencheur de tri n'est pas affiché
     */
    nePasAfficherTriSi?: KfInitialObservable<boolean>;

    /**
     * Liste des définitions de classes à ajouter à l'élément td associé à un item
     */
    classeDefs?: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[];

    /**
     * texte ou composant à afficher dans la ligne de bilan
     */
    bilanDef?: IKfVueTableBilanDef<T>;

    /**
     * valeur initiale et Observable définissant si la colonne n'est pas affichée
     */
    nePasAfficherSi?: KfInitialObservable<boolean>;

    /**
     * valeur initiale et Observable définissant si la colonne est affichée
     */
    afficherSi?: KfInitialObservable<boolean>;
}
