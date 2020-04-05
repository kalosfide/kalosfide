import { KfVueTableCelluleDef } from './kf-vue-table-cellule';
import { KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';

export interface IKfVueTableBilanDef<T> {
    /**
     * Si présent et si la colonne est précédée de colonnes sans bilan, le titre s'étalera sur ces colonnes
     */
    titreDef?: KfVueTableCelluleDef;

    /**
     * Si agrégation des valeurs ne sert que pour la classe css
     */
    valeurDef?: KfVueTableCelluleDef;

    /**
     * Si présent, une étiquette vide est crée pour afficher la valeur agrégée de la colonne
     */
    texteAgrégé?: (items: T[]) => string;

    /**
     * classe à ajouter à l'élément th
     */
    classeDefs?: (string | KfNgClasseDef)[];


    /**
     * Si vrai, seules les valeurs des lignes qui passent les filtres sont agrégées
     */
    visiblesSeulement?: boolean;

    /**
     * Si présent dans l'une des colonnes, une autre ligne est affichée avec ce titre
     * où seules les valeurs des lignes qui passent les filtres sont agrégées
     */
    titreVisiblesSeulement?: KfVueTableCelluleDef;
}
