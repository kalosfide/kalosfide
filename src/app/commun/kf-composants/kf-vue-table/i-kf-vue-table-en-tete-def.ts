import { KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';
import { KfStringDef } from '../kf-partages/kf-string-def';
import { KfVueTableCelluleDef } from './i-kf-vue-table-cellule-def';

export interface IKfVueTableEnTeteDef {
    /**
     * contenu
     */
    titreDef: KfVueTableCelluleDef;

    /**
     * Si présent, la colonne et éventuellement les suivantes seront surmontées du chapeau
     */
    chapeauDef?: KfVueTableCelluleDef;

    /**
     * Si présent, fixe le nombre de colonnes surmontées du chapeau
     */
    longueurChapeau?: number;

    /**
     * classe à ajouter à l'élément th
     */
    classesTh?: (KfNgClasseDef | KfStringDef)[];

    /**
     * Si présent un élément div est ajouté autour du contenu des cellules du corps de la colonne et ces classes lui sont appliquées.
     */
     classesDiv?: (KfNgClasseDef | KfStringDef)[];
}
