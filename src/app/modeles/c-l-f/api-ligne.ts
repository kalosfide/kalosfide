import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';

export interface IApiLigne {

    /**
     * Présent quand la ligne est dans une livraison ou une facture et provient d'une commande dont le tarif a changé
     */
    date: Date;

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    typeCommande?: string;

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    quantité?: number;
    aFixer?: number;
}

/**
 * Objet reçu et stocké dans une liste. Contient seulement les parties no2 et date de la key de la ligne.
 */
export class ApiLigne implements IApiLigne {
    /**
     * No du produit
     */
    no: number;

    /**
     * Présent quand la ligne est dans une livraison ou une facture et provient d'une commande dont le tarif a changé
     */
    date: Date;

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    typeCommande?: string;

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    quantité?: number;
    aFixer?: number;
}

/**
 * Objet à envoyer qui contient la key complète de la ligne
 */
export class ApiLigneAEnvoyer extends KeyUidRnoNo2 implements IApiLigne {

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    typeCommande?: string;

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    quantité?: number;
    aFixer?: number;

    static copieData(de: IApiLigne, vers: IApiLigne) {
        vers.typeCommande = de.typeCommande;
        vers.quantité = de.quantité;
        vers.aFixer = de.aFixer;
    }
}
