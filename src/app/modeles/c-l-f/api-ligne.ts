import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';

export interface IApiLigneData {

    /**
     * Présent quand la ligne est dans une livraison ou une facture et provient d'une commande dont le tarif a changé
     */
    date?: Date;

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
 * Objet reçu
 */
export class ApiLigneData implements IApiLigneData {
    /**
     * No du produit
     */
    no: number;

    /**
     * Présent quand la ligne est dans une livraison ou une facture et provient d'une commande dont le tarif a changé
     */
    date?: Date;

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
 * Objet à envoyer
 */
export class ApiLigne extends KeyUidRnoNo2 implements IApiLigneData {

    /**
     * Présent quand la ligne est dans une livraison ou une facture et provient d'une commande dont le tarif a changé
     */
    date?: Date;

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    typeCommande?: string;

    /**
     * Présent quand la ligne est dans une commande ouverte ou en préparation
     */
    quantité?: number;
    aFixer?: number;

    static copieData(de: IApiLigneData, vers: IApiLigneData) {
        vers.typeCommande = de.typeCommande;
        vers.quantité = de.quantité;
        vers.aFixer = de.aFixer;
    }
}
