import { ApiDocument } from './api-document';
import { Site } from '../site/site';
import { Catalogue } from '../catalogue/catalogue';
import { Client } from '../client/client';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';

/**
 * Contient les données d'un client
 * Objet lu dans l'Api
 */
export class ApiDocumentsData {
    /**
     * LECTURE
     * Site réduit qui peut contenir uid, rno et etat.
     * Ajouté avec uid, rno et etat quand le CLFDocs est stocké et vérifié à chaque lecture du stock pour recharger le stock si changé
     * Chargé avec etat seulement pour vérifier s'il faut recharger le stock.
     */
    site: Site;

    /**
     * LECTURE
     * Chargé avec date seulement pour vérifier s'il faut recharger le stock.
     */
    catalogue: Catalogue;

    /**
     * ENVOI - ne contient que la clé
     */
    client: Client;

    /**
     * LECTURE
     * Présent quand les documents sont chargés pour une édition ou une vue.
     * Pour une vue, contient seulement le document à visualiser.
     * Quand un client va créer ou éditer une commande, contient seulement la dernière commande non refusée.
     * Quand le fournisseur va créer ou éditer le bon de livraison d'un client, contient les commandes de ce client
     * avec date et sans numéro de livraison (il peut y en avoir plusieurs) ou s'il n'y en a pas, la dernière livraison.
     * Quand le fournisseur va créer ou éditer la facture d'un client, contient les livraisons de ce client
     * avec date sans numéro de facture
     * ENVOI
     * Les documents sont réduits à leur no.
     */
    documents: ApiDocument[];

}

export class ApiDocumentsSynthèse {
    keyClient: KeyUidRno;
    noDocs: number[];
}
