import { SitePages, iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { ClientRoutes, ClientPages } from 'src/app/client/client-pages';
import { PageDef } from 'src/app/commun/page-def';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';

export class CommandePages {

    /**
     * Route: commande/bon/:[nomParamNoDoc]
     * Garde des enfants: RedirigeSiContexteChangé
     * Pas de page.
     */
    static bon: PageDef = {
        urlSegment: CLFPages.bon.urlSegment,
        title: CLFPages.bon.title,
        titre: CLFPages.bon.titre,
    };

    /**
     * Route: commande/bon/lignes
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
     * Route: commande/bon/nouveau
     * Page de création d'une nouvelle commande.
     * Table des lignes du document à copier s'il existe.
     * Boutons créer et éventuellement copier
     */
    static nouveau: PageDef = {
        urlSegment: CLFPages.nouveau.urlSegment,
        title: CLFPages.nouveau.title,
        titre: CLFPages.nouveau.titre,
    };

    /**
     * Route: commande/bon/produit
     * Page de choix du produit d'une ligne à ajouter à une commande.
     */
    static choixProduit: PageDef = {
        urlSegment: CLFPages.choixProduit.urlSegment,
        title: CLFPages.choixProduit.title,
        titre: CLFPages.choixProduit.titre,
    };

    /**
     * Route: ./ajoute/:[nomParamNoLigne]
     * Page d'édition d'une ligne à ajouter à une commande.
     * Param nomParamNoLigne: no du produit de la ligne
     */
    static ajoute: PageDef = {
        urlSegment: CLFPages.ajoute.urlSegment,
        title: CLFPages.ajoute.title,
        titre: CLFPages.ajoute.titre,
    };

    /**
     * Route: ./supprime/:[nomParamNoLigne]
     * Page de visualisation d'une ligne avec bouton supprime
     * Param nomParamNoLigne: no du produit de la ligne
     */
    static supprime: PageDef = {
        urlSegment: CLFPages.supprime.urlSegment,
        title: CLFPages.supprime.title,
        titre: CLFPages.supprime.titre,
    };

    /**
     * Route: ./envoi (client).
     * Page de visualisation de la synthèse.
     * Bouton: avant envoi, Enregistrer.
     * Lien: avant envoi, annuler vers ./client/:key/bons; après envoi, vers ./clients
     */
    static envoi: PageDef = {
        urlSegment: CLFPages.envoi.urlSegment,
        title: CLFPages.envoi.title,
        titre: CLFPages.envoi.titre + ' le bon de commande',
    };

    /**
     * Route: ./annule (client).
     * Page d'annulation de la commande ouverte
     * Bouton: Supprimer.
     * Lien: annuler vers ./client/:key/bons (fournisseur) ou ./ (client).
     */
    static annule: PageDef = {
        urlSegment: CLFPages.annule.urlSegment,
        title: CLFPages.annule.title,
        titre: CLFPages.annule.titre + ' la commande',
    };

    static contexte: PageDef = {
        urlSegment: 'contexte',
        title: 'Arrêt',
        titre: 'Arrêt des commandes',
    };
}

export const CommandeRoutes = iSiteRoutePlusSegments(ClientRoutes, [ClientPages.commandes.urlSegment]);
