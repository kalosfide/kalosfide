import { KfVueTableCelluleDef } from './kf-vue-table-cellule';
import { KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';

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
    classeDefs?: (string | KfNgClasseDef)[];
}
