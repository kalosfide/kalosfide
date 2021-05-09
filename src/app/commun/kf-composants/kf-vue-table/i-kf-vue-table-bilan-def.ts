import { KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';

export interface IKfVueTableBilanDef<T> {
    /**
     * Si présent et si la colonne est précédée de colonnes sans bilan, le titre s'étalera sur ces colonnes
     */
    titreDef?: KfVueTableCelluleDef;

    /**
     * Si présent, une étiquette vide est crée pour afficher la valeur agrégée de la colonne.
     */
    texteAgrégé?: (items: T[]) => string;

    /**
     * classe à ajouter à l'élément th
     */
    classeDefs?: (string | KfNgClasseDef)[];


    /**
     * Si vrai, seules les valeurs des lignes qui passent les filtres sont agrégées.
     * Ignoré si titreBilanDesVisibles est défini.
     */
    visiblesSeulement?: boolean;

    /**
     * Si présent dans l'une des colonnes, une seconde ligne de bilan est affichée avec ce titre
     * où seules les valeurs des lignes qui passent les filtres sont agrégées
     */
    titreBilanDesVisibles?: KfVueTableCelluleDef;
}
