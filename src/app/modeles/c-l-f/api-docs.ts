import { ApiDoc } from './api-doc';
import { Catalogue } from '../catalogue/catalogue';
import { Client } from '../client/client';

/**
 * Contient les données d'un client
 * Objet retourné par l'Api
 */
export class ApiDocs {

    /**
     * LECTURE
     * Présent quand les documents sont chargés pour une édition ou une vue.
     * Pour une vue, contient seulement le document à visualiser.
     * Quand un client va créer ou éditer une commande, contient seulement la dernière commande non refusée.
     * Quand le fournisseur va créer ou éditer le bon de livraison d'un client, contient les commandes de ce client
     * avec date et sans numéro de livraison (il peut y en avoir plusieurs) ou s'il n'y en a pas, la dernière livraison.
     * Quand le fournisseur va créer ou éditer la facture d'un client, contient les livraisons de ce client
     * avec date sans numéro de facture
     */
    apiDocs: ApiDoc[];

}

/**
 * Contient les données d'un client
 * Objet retourné par l'Api
 */
export class ApiDocsAvecTarif extends ApiDocs {
    tarif: Catalogue;
}

/**
 * Contient les données d'un document d'un client
 * Objet retourné par l'Api.
 */
export class ApiDocsAvecTarifEtClient extends ApiDocsAvecTarif {
    client: Client;
}
