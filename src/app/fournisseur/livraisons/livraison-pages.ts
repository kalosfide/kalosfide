import { iSiteRoutePlusSegments } from '../../site/site-pages';
import { FournisseurRoutes, FournisseurPages } from '../fournisseur-pages';
import { PageDef } from 'src/app/commun/page-def';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';

const titre = 'Livraison';
const bons = 'Bons de commande';
const bon = 'bon de livraison';

export class LivraisonPages {
    /**
     * Route: livraison/clients
     * Page de choix du client pour lequel on veut créer un document de synthèse.
     * Table de tous les clients avec leurs nombres de bons à synthétiser et des liens vers livraison/client/:[nomParamKeyClient].
     */
    static choixClient: PageDef = {
        urlSegment: CLFPages.choixClient.urlSegment,
        title: CLFPages.choixClient.title,
        titre: CLFPages.choixClient.titre,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]
     * Page titre contenant toutes les pages d'édition d'une synthèse d'un client.
     * Param nomParamKeyClient: key du client
     */
    static client: PageDef = {
        urlSegment: CLFPages.client.urlSegment,
        title: CLFPages.client.title,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bons
     * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
     * Table des bons du client avec leur état de préparation, lien vers la page Bon et case de sélection.
     * Bouton: Vérifier.
     */
    static bons: PageDef = {
        urlSegment: CLFPages.bons.urlSegment,
        title: CLFPages.bons.title,
        titre: bons,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]
     * Page titre contenant toutes les pages d'édition d'un document.
     * Param nomParamNoDoc: no du document
     */
    static bon: PageDef = {
        urlSegment: CLFPages.bon.urlSegment,
        title: CLFPages.bon.title,
        titre: CLFPages.bon.titre,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]/lignes
     * Page des lignes à éditer d'un document.
     * Table des lignes du document avec champs à fixer et éventuellement source, boutons ou liens éventuels: supprimer, copier, annuler.
     * Lien ajouter vers choixProduit.
     */
    static lignes: PageDef = {
        urlSegment: CLFPages.lignes.urlSegment,
        lien: CLFPages.lignes.lien,
        title: CLFPages.lignes.title,
        titre: CLFPages.lignes.titre,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bon/0/nouveau
     * Page des lignes à éditer d'un document.
     * Table des lignes du document avec champs à fixer et éventuellement source, boutons ou liens éventuels: supprimer, copier, annuler.
     * Lien ajouter vers choixProduit.
     */
    static nouveau: PageDef = {
        urlSegment: CLFPages.nouveau.urlSegment,
        title: CLFPages.nouveau.title,
        titre: CLFPages.nouveau.titre + ' virtuel',
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]/produit
     * Page de choix du produit d'une ligne à ajouter à une commande.
     */
    static choixProduit: PageDef = {
        urlSegment: CLFPages.choixProduit.urlSegment,
        title: CLFPages.choixProduit.title,
        titre: CLFPages.choixProduit.titre,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]/ajoute/:[nomParamNoLigne]
     * Page d'édition d'une ligne à ajouter à une commande.
     * Param nomParamNoLigne: no du produit de la ligne
     */
    static ajoute: PageDef = {
        urlSegment: CLFPages.ajoute.urlSegment,
        title: CLFPages.ajoute.title,
        titre: CLFPages.ajoute.titre,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]/supprime/:[nomParamNoLigne]
     * Page de visualisation d'une ligne avec bouton supprime
     * Param nomParamNoLigne: no du produit de la ligne
     */
    static supprime: PageDef = {
        urlSegment: CLFPages.supprime.urlSegment,
        title: CLFPages.supprime.title,
        titre: CLFPages.supprime.titre,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/envoi.
     * Page de visualisation de la synthèse.
     * Bouton: avant envoi, Enregistrer.
     * Lien: avant envoi, annuler vers livraison/client/:key/bons; après envoi, vers livraison/clients
     */
    static envoi: PageDef = {
        urlSegment: CLFPages.envoi.urlSegment,
        title: CLFPages.envoi.title,
        titre: CLFPages.envoi.titre,
    };

    /**
     * Route: livraison/client/:[nomParamKeyClient]/annule.
     * Page d'annulation de la commande ouverte (la commande virtuelle si fournisseur).
     * Bouton: Supprimer.
     * Lien: annuler vers livraison/client/:key/bons (fournisseur) ou livraison/ (client).
     */
    static annule: PageDef = {
        urlSegment: CLFPages.annule.urlSegment,
        title: CLFPages.annule.title,
        titre: CLFPages.annule.titre,
    };
}

export const LivraisonRoutes = iSiteRoutePlusSegments(FournisseurRoutes, [FournisseurPages.livraison.urlSegment]);
