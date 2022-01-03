
export const ApiController = {
    admin: 'admin',
    utilisateur: 'utilisateur',
    nouveauSite: 'nouveauSite',
    role: 'role',
    site: 'site',
    fournisseur: 'fournisseur',
    client: 'client',
    catalogue: 'catalogue',
    produit: 'produit',
    categorie: 'categorie',
    commande: 'commande',
    detailCommande: 'detailCommande',
    livraison: 'livraison',
    peuple: 'peuple',
    facture: 'facture',
    document: 'document',
};

export const ApiAction = {

    peuple: {
        estPeuple: 'estPeuple',
        peuple: 'peuple',
    },

    data: {
        ajoute: 'ajoute',
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
        dernierNo: 'dernierNo',
    },

    utilisateur: {
        ajoute: 'ajoute',
        confirmeEmail: 'confirmeEmail',
        connecte: 'connecte',
        deconnecte: 'deconnecte',
        oubliMotDePasse: 'oubliMotDePasse',
        réinitialiseMotDePasse: 'réinitialiseMotDePasse',
        changeMotDePasse: 'changeMotDePasse',
        changeEmail: 'changeEmail',
        confirmeChangeEmail: 'confirmeChangeEmail',
        inviteClient: 'inviteClient',
        invitation: 'invitation',
        invitations: 'invitations',
        devenirClient: 'devenirClient',
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
        session: 'session',
    },

    nouveauSite: {
        demande: 'demande',
        invite: 'invite',
        invitation: 'invitation',
        active: 'active',
    },

    admin: {
        fournisseurs: 'fournisseurs',
        active: 'active',
        ajoute: 'ajoute',
    },
    catalogue: {
        /** GET le catalogue actuel d'un site
         * params id du site
         */
        complet: 'complet',
        disponible: 'disponible',
        etat: 'etat',
        // modification
        commence: 'commence',
        termine: 'termine',
    },
    categorie: {
        ajoute: 'ajoute',
        edite: 'edite',
        supprime: 'supprime',
    },
    produit: {
        ajoute: 'ajoute',
        edite: 'edite',
        supprime: 'supprime',
    },
    client: {
        /**
         * ajoute un client
         * param: vue du client à ajouter
         */
        ajoute: 'ajoute',

        /**
         * edite un client
         * param: vue du client à editer
         */
        edite: 'edite',

        active: 'active',
        inactive: 'inactive',

        /**
         * charge la liste des clients
         * param: keySite
         */
        liste: 'liste',
    },

    bon: {

        /**
         * Si le site est d'état Catalogue
         *  l'Api retourne l'erreur 409 avec contexte Catalogue: état site = Catalogue, date catalogue = null.
         * Sinon, le site est d'état Ouvert,
         *  si le stock existe et n'est pas un contexte, la date du catalogue du stock est passée en paramètre
         *      si la date du catalogue du stock est antérieure à celle du catalogue de la bdd,
         *          l'Api retourne l'erreur 409 avec contexte Périmé: état site = ouvert, date catalogue = celle du catalogue de la bdd
         *      sinon, le stock est à jour,
         *          l'Api retourne un ApiDocs vide
         * sinon, le stock n'existe pas ou est un contexte,
         *      l'Api retourne un ApiDocs dont le champ Documents contient les données pour client de la dernière commande du client
         * Param: key du Client et date du catalogue stocké s'il y en a un.
         */
        encours: 'enCours',

        /**
         * Crée une nouvelle commande d'un client sans détails.
         * Param: key du Client.
         * Retour: key de la commande créée.
         * Condition: Site ouvert.
         * Retour si pas condition: BadRequest avec les erreurs etatSite et dateCatalogue.
         * Action si pas condition: .
         * Action si catalogue changé: .
         */
        nouveau: 'nouveau',

        /**
         * Crée une nouvelle commande d'un client en copiant les détails de la dernière commande ou livraison envoyées.
         * Param: key du Client
         * Retour: key de la commande créée.
         * Condition: Site ouvert.
         * Sinon: Conflict avec les erreurs etatSite et dateCatalogue.
         */
        clone: 'clone',

        /**
         * Supprime les lignes d'un bon et si le bon est virtuel, supprime le bon.
         * Param: key du clfDoc
         */
        efface: 'efface',

        /**
         * Fixe la date de la commande sur la date en cours.
         * Param: key du Client
         * Retour: key et date de la commande.
         * Condition: Site ouvert.
         * Sinon: BadRequest avec les erreurs etatSite et dateCatalogue.
         */
        envoi: 'envoi',

        /**
         * Ajoute une ligne à une commande
         * Data: ApiLigne de la ligne à ajouter
         */
        ajoute: 'ajoute',

        /**
         * Supprime une ligne d'une commande
         * Data: key de la ligne à supprimer
         */
        supprime: 'supprime',
    },

    docCLF: {

        /**
         * Le ApiDocs retourné par l'Api contient les listes des documents à synthétiser de tous les clients avec leur état de préparation.
         * Param: key du Site
         */
        clients: 'clients',

        /**
         * Le ApiDocs retourné par l'Api contient les documents à synthétiser d'un client avec leurs lignes.
         * Param: key du Client
         */
        client: 'client',

        /**
         * Fixe la date du document et pour livraison et facture, fixe et retourne le numéro.
         * Crée le document de synthèse.
         * Data: ApiDocument contenant lignes de synthèse du document
         * Param: key du Client
         * Retour: key et date du document de synthèse créé.
         */
        envoi: 'envoi',

        /**
         * Edite une ligne d'une commande
         * Data: ApiLigne de la ligne éditée
         */
        edite: 'edite',

        /**
         * Fixe la valeur du champ aFixer
         * Data: key de la ligne + valeur à fixer
         */
        fixe: 'fixe',

        /**
         * Copie le champ source d'une ligne dans son champ aFixer
         * Data: key de la ligne
         */
        copie1: 'copie1',

        /**
         * Copie le champ source de chaque ligne d'un document à synthétiser dans son champ aFixer.
         * Data: key du document
         */
        copieD: 'copieD',

        /**
         * Copie le champ source de chaque ligne de chaque document à synthétiser d'une liste dans son champ aFixer.
         * Data: CLFDocs contenant keyClient et un documents contenant les CLFDoc réduits à leur no.
         */
        copieT: 'copieT',

        /**
         * Fixe à 0 le champ aFixer d'une ligne d'un document à synthétiser si ce champ n'est pas défini
         * Data: key du document
         */
        annule1: 'annule1',

        /**
         * Fixe à 0 le champ aFixer de chaque ligne d'un document à synthétiser si ce champ n'est pas défini
         * Data: key du document
         */
        annuleD: 'annuleD',

        /**
         * Fixe à 0 le champ aFixer de chaque ligne de chaque document à synthétiser d'une.
         * Data: CLFDocs contenant keyClient et un documents contenant les CLFDoc réduits à leur no.
         */
        annuleT: 'annuleT',
    },

    document: {
        /**
         * L'Api retourne la liste des ApiClientBilanDocs du site.
         * Param: key du Site
         */
        bilans: 'bilans',

        /**
         * Le ApiDocs retourné par l'Api contient les résumés des documents terminés de tous les clients.
         * Param: key du Site
         */
        clients: 'clients',

        /**
         * Le ApiDocs retourné par l'Api contient les résumés des documents terminés d'un client.
         * Param: key du Client
         */
        client: 'client',

        /**
         * Le ApiDocs retourné par l'Api contient les résumés des documents envoyés à l'utilisateur
         * depuis sa dernière déconnection (bons de commande pour les sites dont l'utilisateur est fournisseur,
         * bons de livraison et factures pour les sites dont l'utilisateur est client).
         */
        nouveaux: 'nouveaux',

        /**
         * Le ApiDocs retourné par l'Api contient le document terminé d'un client avec ses lignes.
         * Param: key du Document
         */
        commande: 'commande',
        livraison: 'livraison',
        facture: 'facture',

        /**
         * Retourne vrai si le document (bon de livraison ou facture) recherché existe.
         * Param: key du site et no du document
         */
        cherche: 'cherche',
    },
};
