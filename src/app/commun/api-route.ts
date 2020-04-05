
export const ApiController = {
    motdepasse: 'motdepasse',
    utilisateur: 'utilisateur',
    enregistrement: 'enregistrement',
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
    motdepasse: {
        options: 'options',
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
        connecte: 'connecte',
        deconnecte: 'deconnecte',
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
    },
    enregistrement: {
        fournisseur: 'fournisseur',
        client: 'client',
        userNamePris: 'userNamePris',
        emailPris: 'emailPris',
    },
    fournisseur: {
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
        trouveParSite: 'trouveParSite',
    },
    site: {
        liste: 'liste',
        trouveParNom: 'trouveParNom',
        litNbs: 'litNbs',
        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
        titrePris: 'titrePris',
        titrePrisParAutre: 'titrePrisParAutre',
        etat: 'etat',
    },
    catalogue: {
        /** GET le catalogue actuel d'un site
         * params uid, rno du site
         */
        complet: 'complet',
        disponible: 'disponible',
        commande: 'commande',
        livraison: 'livraison',
        obsolete: 'obsolete',
        // modification
        commence: 'commence',
        termine: 'termine'
    },
    categorie: {
        ajoute: 'ajoute',
        edite: 'edite',
        supprime: 'supprime',

        lit: 'lit', // une vue où le champ nbProduits est présent

        // listes groupées
        liste: 'liste', // données
        listeNbProduits: 'nbProduits', // vues où le champ nbProduits est présent
        disponibles: 'disponibles', // données catégories ayant des produits disponibles
        changes: 'changes', // états

        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
    },
    produit: {
        ajoute: 'ajoute',
        edite: 'edite',
        fixePrix: 'prix',
        supprime: 'supprime',

        lit: 'lit', // une vue où nomCatégorie est présent

        // listes groupées
        liste: 'liste', // données
        disponibles: 'disponibles', // données

        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
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

        /**
         * change l'état d'un client
         *  nouveau -> actif (fournisseur)
         *  actif <-> inactif (client)
         *  nouveau ou actif ou inactif -> exclu (fournisseur)
         */
        etat: 'etat',

        /**
         * charge la liste des clients
         * param: keySite
         */
        liste: 'liste',

        /**
         * charge la liste des clients qui ont ouvert un compte depuis une date
         * param: keySite
         * param: date du stock
         */
        rafraichit: 'depuis',
    },

    commande: {

        /**
         * Le CLFDocs lu dans l'Api contient la dernière commande d'un client avec ses lignes.
         * Param: key du Client.
         */
        encours: 'enCours',

        /**
         * Le CLFDocs lu dans l'Api contient uniquement un site avec son état et un catalogue avec sa date.
         * Param: key du site.
         */
        contexte: 'contexte',

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
         * Sinon: BadRequest avec les erreurs etatSite et dateCatalogue.
         */
        clone: 'clone',

        /**
         * Supprime les détails de la commande créés par l'utilisateur. S'il reste des détails, fixe leur aLivrer à 0.
         * S'il n'y a plus de détails, supprime la commande.
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
         * Le CLFDocs lu dans l'Api contient les listes des documents à synthétiser de tous les clients avec leur état de préparation.
         * Param: key du Site
         */
        clients: 'clients',

        /**
         * Le CLFDocs lu dans l'Api contient les documents à synthétiser d'un client avec leurs lignes.
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

    peuple: {
        estPeuple: 'estPeuple',
        peuple: 'peuple',
    },

    document: {
        /**
         * Le CLFDocs lu dans l'Api contient les résumés des documents terminés de tous les clients.
         * Param: key du Site
         */
        clients: 'clients',

        /**
         * Le CLFDocs lu dans l'Api contient les résumés des documents terminés d'un client.
         * Param: key du Client
         */
        client: 'client',

        /**
         * Le CLFDocs lu dans l'Api contient le document terminé d'un client avec ses lignes.
         * Param: key du Document
         */
        commande: 'commande',
        livraison: 'livraison',
        facture: 'facture',
    },
};
