import { KfComposant } from '../kf-composant/kf-composant';

/**
 * Si string, la valeur de la cellule ne change pas et la colonne de la cellule a un tri.
 * Si valeur
 */
export type KfVueTableCelluleDef = string | (() => string) | KfComposant;

export interface IKfVueTableCelluleDef {
    /**
     * Texte à afficher dans la cellule.
     * Si présent, la valeur de la cellule est un texte constant.
     * Si présent, stringDef et composant sont absents et la colonne a un tri
     * dans l'ordre de valeur si valeur est présent, de texte sinon.
     */
    texte?: string;
    /**
     * Valeur de la cellule pour le tri.
     * Si présent, texte doit être présent.
     */
    valeur?: string | number | Date;
    /**
     * Fonction de mise à jour du texte affiché si le contenu dépend d'autres cellules dont la valeur peut changer.
     * Si présent, texte et valeur et composant sont absents et la colonne n'a pas de tri.
     */
    stringDef?: () => string;
    /**
     * Composant à afficher dans la cellule.
     * Si présent, texte et valeur et stringDef sont absents et la colonne n'a pas de tri.
     */
    composantContenu?: KfComposant;
}
