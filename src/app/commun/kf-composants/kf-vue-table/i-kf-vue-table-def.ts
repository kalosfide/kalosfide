import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfVueTableOutils } from './kf-vue-table-outils';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfVueTablePagination } from './kf-vue-table-pagination';
import { DirectionDeTri } from '../../outils/tri';
import { IKfVueTableColonneNoLigneDef } from './i-kf-vue-table-colonne-no-ligne-def';
import { IKfVueTableNavigationAuClavierDef } from './i-kf-vue-table-navigation-au-clavier-def';

export interface IKfVueTableDef<T> {
    /**
     * Si présent et vrai, une colonne est ajoutée pour numéroter les lignes
     */
    colonneNoLigneDef?: IKfVueTableColonneNoLigneDef;

    /**
     * Définitions des colonnes
     */
    colonnesDef: IKfVueTableColonneDef<T>[];

    /**
     * si avecEnTêtesDeLigne est vrai, la première cellule de chaque ligne est dans un th
     */
    avecEnTêtesDeLigne?: boolean;

    /**
     * Si présent, est appelé à la création de la ligne pour que l'item puisse avoir une référence à
     * la ligne. pour pouvoir lui demander de se rafraichir
     */
    itemRéférenceLigne?: (item: T, ligne: KfVueTableLigne<T>) => void;

    /**
     * pour donner une valeur à chaque ligne et à la vueTable
     */
    superGroupe?: (item: T) => KfSuperGroupe;

    /**
     * pour ajouter classe et style aux éléments tr de la table
     */
    gereCssLigne?: (item: T) => KfGéreCss;

    /**
     * Retourne la valeur de l'attribut id de l'élément tr de la ligne d'un item.
     * Si présent, un attribut id est ajouté à chaque élément tr des lignes des items
     */
    id?: (item: T) => string;

    /**
     * pour ajouter à l'élément tr de l'item un onclick
     */
    quandClic?: (item: T) => (() => void);

    /**
     * pour ajouter dans une colonne invisible, les champs non éditables du superGroupe de l'item
     */
    composantsAValider?: (item: T) => KfComposant[];

    /**
     * Si défini, une barre d'outils est affichée au dessus de la table
     */
    outils?: KfVueTableOutils<T>;

    /**
     * Si défini, le tri de la colonne ayant ce nom est appliqué lors du chargement des données dans la table
     */
    triInitial?: {
        colonne: string,
        direction: DirectionDeTri,
    };
    /**
     * Si défini et vrai, aucune icone n'est affichée pour montrer que cliquer sur l'en-tête d'une colonne déclenche un tri
     */
    nePasMontrerIconeDeTriSiPasTrié?: boolean;

    /**
     * Si défini, une barre de pagination est affichée au dessus de la table
     */
    pagination?: KfVueTablePagination<T>;

    /**
     * Si défini, la navigation entre cellules avec le clavier sera installée
     */
    navigationAuClavier?: IKfVueTableNavigationAuClavierDef;

}
