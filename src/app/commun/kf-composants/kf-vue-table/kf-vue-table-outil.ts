import { KfVueTableOutils } from './kf-vue-table-outils';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfComposant } from '../kf-composant/kf-composant';

export interface IKfVueTableOutilVue {
    composant: KfComposant;
}

export interface IKfVueTableOutil<T> extends IKfVueTableOutilVue {
    /**
     * Nom de l'outil unique parmi les outils de la vueTable
     */
    nom: string;
    /**
     * Si l'outil est un filtre (ou cherche), retourne une fonction indiquant si la ligne passe le filtre.
     */
    valide?: (ligne: KfVueTableLigne<T>) => boolean;
    /**
     * Présent si le changement de valeur de l'outil doit déclencher le filtrage de la table
     */
    initialise?: (parent: KfVueTableOutils<T>) => void;
    /**
     * Présent et vrai si l'outil est un filtre (ou cherche) qui a une valeur
     */
    filtreActif?: boolean;
}
