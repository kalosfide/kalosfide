import { PageDef } from 'src/app/commun/page-def';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';

const titre = 'Livraison';
const bons = 'Bons de commande';
const bon = 'bon de livraison';

export class LivraisonPages {
    /**
     * Route: livraison/clients
     * Page de choix du client pour lequel on veut créer un document de synthèse.
     * Table de tous les clients avec leurs nombres de bons à synthétiser et des liens vers livraison/client/:[NomParam.keyClient].
     */
    static choixClient: PageDef = {
        path: CLFPages.choixClient.path,
        title: CLFPages.choixClient.title,
        titre: CLFPages.choixClient.titre,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]
     * Page titre contenant toutes les pages d'édition d'une synthèse d'un client.
     * Param NomParam.keyClient: key du client
     */
    static client: PageDef = {
        path: CLFPages.client.path,
        title: CLFPages.client.title,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/bons
     * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
     * Table des bons du client avec leur état de préparation, lien vers la page Bon et case de sélection.
     * Bouton: Vérifier.
     */
    static bons: PageDef = {
        path: CLFPages.bons.path,
        title: CLFPages.bons.title,
        titre: bons,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/bon/:[NomParam.noDoc]
     * Page titre contenant toutes les pages d'édition d'un document.
     * Param NomParam.noDoc: no du document
     */
    static bon: PageDef = {
        path: CLFPages.bon.path,
        title: CLFPages.bon.title,
        titre: CLFPages.bon.titre,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/bon/:[NomParam.noDoc]/lignes
     * Page des lignes à éditer d'un document.
     * Table des lignes du document avec champs à fixer et éventuellement source, boutons ou liens éventuels: supprimer, copier, annuler.
     * Lien ajouter vers choixProduit.
     */
    static lignes: PageDef = {
        path: CLFPages.lignes.path,
        lien: CLFPages.lignes.lien,
        title: CLFPages.lignes.title,
        titre: CLFPages.lignes.titre,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/bon/0/nouveau
     * Page des lignes à éditer d'un document.
     * Table des lignes du document avec champs à fixer et éventuellement source, boutons ou liens éventuels: supprimer, copier, annuler.
     * Lien ajouter vers choixProduit.
     */
    static nouveau: PageDef = {
        path: CLFPages.nouveau.path,
        title: CLFPages.nouveau.title,
        titre: 'Nouveau bon de commande virtuel',
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/bon/:[NomParam.noDoc]/produit
     * Page de choix du produit d'une ligne à ajouter à une commande.
     */
    static choixProduit: PageDef = {
        path: CLFPages.choixProduit.path,
        title: CLFPages.choixProduit.title,
        titre: CLFPages.choixProduit.titre,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/bon/:[NomParam.noDoc]/ajoute/:[NomParam.noLigne]
     * Page d'édition d'une ligne à ajouter à une commande.
     * Param NomParam.noLigne: no du produit de la ligne
     */
    static ajoute: PageDef = {
        path: CLFPages.ajoute.path,
        title: CLFPages.ajoute.title,
        titre: CLFPages.ajoute.titre,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/envoi.
     * Page de visualisation de la synthèse.
     * Bouton: avant envoi, Enregistrer.
     * Lien: avant envoi, annuler vers livraison/client/:key/bons; après envoi, vers livraison/clients
     */
    static envoi: PageDef = {
        path: CLFPages.envoi.path,
        title: CLFPages.envoi.title,
        titre: CLFPages.envoi.titre,
    };

    /**
     * Route: livraison/client/:[NomParam.keyClient]/annule.
     * Page d'annulation de la commande ouverte (la commande virtuelle si fournisseur).
     * Bouton: Supprimer.
     * Lien: annuler vers livraison/client/:key/bons (fournisseur) ou livraison/ (client).
     */
    static annule: PageDef = {
        path: CLFPages.annule.path,
        title: CLFPages.annule.title,
        titre: CLFPages.annule.titre,
    };
}
