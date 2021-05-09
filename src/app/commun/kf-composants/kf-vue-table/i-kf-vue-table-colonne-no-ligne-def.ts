import { KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';

export interface IKfVueTableColonneNoLigneDef {
    /**
     * Liste des définitions de classes à ajouter à l'élément td associé à un numéro de ligne
     */
    classeDefs?: (string | KfNgClasseDef)[];

    /**
     * texte de la ligne d'en-tête
     */
    texteEnTete?: string;

    /**
     * Liste des définitions de classes à ajouter à l'élément th de l'en-tête
     */
    classeDefsEnTete?: (string | KfNgClasseDef)[];

    /**
     * Présent et vrai pour associer un tri à la colonne
     */
    avecTri?: boolean;
}
