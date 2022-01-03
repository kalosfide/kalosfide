import { CatalogueApi } from '../catalogue/catalogue';
import { ApiLigne } from './api-ligne';

/**
 * Objet envoyé par l'api qui contient les données d'un document.
 */
export class ApiDoc {

    /**
     * Présent quand le document fait partie d'une liste.
     * Ajouté quand le document est créé sinon.
     * Présent quand le document est envoyé.
     */
    id: number;

    /**
     * Présent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse.
     * Présent quand le document est envoyé si c'est une commande.
     * COMMANDE: No de la commande incrémenté par client.
     * LVRAISON, FACTURE: No incrémenté par site. Fixé quand le document est enregistré.
     */
    no: number;

    /**
     * Présent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse.
     * Absent quand le document est envoyé.
     * COMMANDE: Date de la commande.
     * Fixée quand le bon de commande est envoyé si la commande a été créée par le client.
     * Sinon, égale à DATE_NULLE puis fixée à la date de la livraison quand le bon de livraison est envoyé.
     */
    date?: Date;

    /**
     * Présent quand le document a été traité dans un parent qui a été envoyé.
     * Absent quand le document est envoyé.
     */
    noGroupe?: number;

    /**
     * Présent quand le document a été traité dans un parent qui a été envoyé.
     * Absent quand le document est envoyé.
     */
    dateGroupe?: Date;

    /**
     * Présent quand le document est une synthèse qui a été envoyé et qui est chargée por une vue.
     * Absent quand le document est envoyé.
     */
    noBons?: number[];

    /**
     * Présent uniquement si le document fait partie d'une liste de vues
     * ou si c'est un bon de livraison destiné à servir de modèle à un bon de commande virtuel
     */
    type?: string;

    /**
     * Ajouté quand le document fait partie d'une synthèse. Fixé à vrai ou à faux quand l'éditeur du doc dans la
     * page bons change de valeur.
     */
    choisi?: boolean;

    /**
     * Absent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse si certaines des lignes concernent des produits qui ont changé
     * par rapport au catalogue en vigueur et contient seulement les prix datés à ajouter au catalogue en vigueur pour
     * pouvoir calculer les coûts des lignes du document.
     * Présent si le document est chargé pour une vue et contient seulement les produits datés des lignes du document.
     * Absent quand le document est envoyé.
     */
    tarif?: CatalogueApi;

    /**
     * Absent quand le document fait partie d'une liste.
     * Présent quand le document fait partie d'une synthèse.
     * Présent quand le document est envoyé s'il s'agit d'une synthèse.
     */
    lignes?: ApiLigne[];

    /**
     * Présent quand le document fait partie d'une liste.
     * Absent quand le document est envoyé.
     */
    nbLignes?: number;

    /**
     * Coût total du document
     * Présent quand le document fait partie d'une liste.
     * Absent quand le document est envoyé.
     */
    total?: number;

    /**
     * Présent et vrai quand le document fait partie d'une liste si le total est incomplet.
     * Absent quand le document est envoyé.
     */
    incomplet?: boolean;

    static prêt(apiDoc: ApiDoc): boolean {
        return apiDoc.nbLignes > 0 && !apiDoc.incomplet;
    }
}
