import { KfVueTableCelluleDef } from './kf-vue-table-cellule';
import { Tri } from '../../outils/tri';
import { KfNgClasseDefDe } from '../kf-partages/kf-gere-css-classe';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';
import { IKfVueTableBilanDef } from './i-kf-vue-table-bilan-def';
import { IKfVueTableEnTeteDef } from './i-kf-vue-table-en-tete-def';

export interface IKfVueTableColonneDef<T> {
    nom: string;

    /**
     * texte ou composant à afficher dans la ligne d'en-tête
     */
    enTeteDef?: IKfVueTableEnTeteDef;

    /**
     * tri associè à la colonne
     */
    tri?: Tri<T>;

    /**
     * valeur initiale et Observable définissant si le tri n'est pas affichée
     */
    nePasAfficherTriSi?: KfInitialObservable<boolean>;

    /**
     * valeur initiale et Observable définissant si le tri est affichée
     */
    afficherTriSi?: KfInitialObservable<boolean>;

    /**
     * texte ou composant à afficher dans l'élément td associèe à l'item
     */
    créeContenu: (item: T) => KfVueTableCelluleDef;

    /**
     * classe à ajouter à l'élément td associèe à l'item
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
