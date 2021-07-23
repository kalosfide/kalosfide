import { PageDef } from 'src/app/commun/page-def';

export class CLFPages {
    static nomParamKeyClient = 'key';
    static nomParamNoDoc = 'no';
    static nomParamNoLigne = 'no2';
    static nomParamKeyDoc = 'key';

    /**
     * Route: (livraison ou facture)/clients
     * Page de choix du client pour lequel on veut créer un document de synthèse.
     * Table de tous les clients avec leurs nombres de bons à synthétiser et des liens vers ./client/:key.
     */
    static choixClient: PageDef = {
        urlSegment: 'clients',
        title: 'Clients',
        titre: 'Choix du client',
    };

    /**
     * Route: (livraison ou facture)/client/:[nomParamKeyClient]
     * Page titre contenant toutes les pages d'édition d'une synthèse d'un client.
     * Param nomParamKeyClient: key du client
     */
    static client: PageDef = {
        urlSegment: 'client',
        title: 'Client'
    };

    /**
     * Route: (livraison ou facture)/client/:[nomParamKeyClient]/bons
     * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
     * Table des bons du client avec leur état de préparation, lien vers la page Bon et case de sélection.
     * Bouton: Vérifier.
     */
    static bons: PageDef = {
        urlSegment: 'bons',
        title: 'Bons',
        titre: 'Bons',
    };

    /**
     * Route: commande/bon ou (livraison ou facture)/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]
     * Page titre contenant toutes les pages d'édition d'un document.
     * Param nomParamNoDoc: no du document
     */
    static bon: PageDef = {
        urlSegment: 'bon',
        title: 'Bon',
        titre: 'Bon',
    };

    /**
     * Route: commande/bon/nouveau ou livraison/client/:[nomParamKeyClient]/bon/0/nouveau.
     * Page de création d'une nouvelle commande.
     * Table des lignes du document à copier s'il existe.
     * Lien annuler si livraison, vers livraison/client/:[nomParamKeyClient].
     * Boutons créer et éventuellement copier
     */
    static nouveau: PageDef = {
        urlSegment: 'nouveau',
        title: 'Nouveau',
        titre: 'Nouveau bon de commande'
    };

    /**
     * Route: commande/bon/lignes ou livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]/lignes.
     * Page des lignes à éditer d'un document.
     * Table des lignes du document avec champs à fixer et éventuellement source, boutons ou liens éventuels: supprimer, copier, annuler.
     * Lien ajouter vers choixProduit.
     */
    static lignes: PageDef = {
        urlSegment: 'lignes',
        lien: 'Retour aux lignes',
        title: 'Lignes',
        titre: 'Lignes',
    };

    /**
     * Route: commande/bon/produit ou livraison/client/:[nomParamKeyClient]/bon/0/produit.
     * Page de choix du produit d'une ligne à ajouter à une commande.
     */
    static choixProduit: PageDef = {
        urlSegment: 'produit',
        title: 'Produit',
        titre: 'Choisir un produit',
    };

    /**
     * Route: commande/bon/ajoute/:[nomParamNoLigne] ou livraison/client/:[nomParamKeyClient]/bon/0/ajoute/:[nomParamNoLigne]
     * Page d'édition d'une ligne à ajouter à une commande.
     * Param nomParamNoLigne: no du produit de la ligne
     */
    static ajoute: PageDef = {
        urlSegment: 'ajoute',
        title: 'Ajoute',
        titre: 'Ajouter une ligne',
    };

    /**
     * Route: commande/bon/supprime/:[nomParamNoLigne] ou livraison/client/:[nomParamKeyClient]/bon/0/supprime/:[nomParamNoLigne]
     * Page de visualisation d'une ligne avec bouton supprime
     * Param nomParamNoLigne: no du produit de la ligne
     */
    static supprime: PageDef = {
        urlSegment: 'supprime',
        title: 'Supprime',
        titre: 'Supprimer la ligne',
    };

    /**
     * Route: commande/bon/annule ou .livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]/annule.
     * Page d'annulation de la commande ouverte (la commande virtuelle si fournisseur).
     * Bouton: Supprimer.
     * Lien: annuler vers commande/bon ou livraison/client/:key/bons ou commande/bon.
     */
    static annule: PageDef = {
        urlSegment: 'annule',
        title: 'Annule',
        titre: 'Annuler la commande',
    };

    /**
     * Route: commande/bon/envoi ou (livraison ou facture)/client/:[nomParamKeyClient]/envoi.
     * Page de visualisation de la synthèse ou du bon de commande.
     * Bouton: avant envoi, Enregistrer.
     * Lien avant envoi: annuler vers (livraison ou facture)/client/:[nomParamKeyClient]/bons ou commande/bon.
     * Lien après envoi: vers (livraison ou facture)/clients
     */
    static envoi: PageDef = {
        urlSegment: 'envoi',
        title: 'Enregistrer',
        titre: 'Enregistrer',
    };

    static liste: PageDef = {
        urlSegment: 'liste',
        title: 'Liste',
        lien: 'Retour à la liste',
        titre: 'Liste'
    };

    static commande: PageDef = {
        urlSegment: 'commande',
        title: 'Commande',
        titre: 'Bon de commande'
    };

    static livraison: PageDef = {
        urlSegment: 'livraison',
        title: 'Bon de livraison',
        titre: 'Livraison',
    };

    static facture: PageDef = {
        urlSegment: 'facture',
        title: 'Facture',
        titre: 'Facture',
    };
}
