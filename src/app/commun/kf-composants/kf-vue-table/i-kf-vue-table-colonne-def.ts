import { KfNgClasseDef, KfNgClasseDefDe } from '../kf-partages/kf-gere-css-classe';
import { ValeurEtObservable } from '../../outils/valeur-et-observable';
import { KfStringDef } from '../kf-partages/kf-string-def';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';
import { KfVueTableCellule } from './kf-vue-table-cellule';

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
     * Si présent, itemRéférenceLigne doit être présent dans le IKfVueTableDef<T> pour que l'item puisse avoir une référence à
     * la ligne.
     * Si présent et égal à 'rafraichit', l'appel à quandItemModifié d'une ligne déclenche le rafraichissement de la cellule de
     * cette ligne et cette colonne: son contenu est recalculé.
     * Si présent et égal à une fonction, l'appel à quandItemModifié d'une ligne déclenche l'appel de cette fonction pour la cellule de
     * cette ligne et cette colonne.
     */
    quandItemModifié?: 'rafraichit' | ((cellule: KfVueTableCellule<T>) => void);

    /**
     * Retourne -1 si t1 est avant t2, 1 si t1 est après t2, 0 sinon
     * Présent pour associer un tri à la colonne
     */
    compare?: (t1: T, t2: T) => number;

    /**
     * valeur initiale et Observable définissant si le déclencheur de tri n'est pas affiché
     */
    nePasAfficherTriSi?: ValeurEtObservable<boolean>;

    /**
     * Liste des définitions de classes à ajouter à l'élément td de la cellule d'un item
     */
    classesTd?: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[];

    /**
     * texte ou composant à afficher dans la ligne de bilan
     */
    bilanDef?: IKfVueTableBilanDef<T>;

    /**
     * valeur initiale et Observable définissant si la colonne n'est pas affichée
     */
    nePasAfficherSi?: ValeurEtObservable<boolean>;

    /**
     * valeur initiale et Observable définissant si la colonne est affichée
     */
    afficherSi?: ValeurEtObservable<boolean>;

    /**
     * Valeur de la propriété css width d'un htmlElement col.
     * Si présent dans une colonne, le style table-layout: fixed est appliqué à la table
     * et un élément colgroup est ajouté.
     */
    largeur?: string;

    /**
     * Liste des définitions de classes à ajouter à l'élement col.
     * Si présent dans une colonne, le style table-layout: fixed est appliqué à la table.
     */
    classesCol?: (KfNgClasseDef | KfStringDef)[];

    /**
     * Si présent un élément div est ajouté autour du contenu des cellules du corps de la colonne et ces classes lui sont appliquées.
     */
     classesDiv?: (KfNgClasseDef | KfStringDef)[];
}
