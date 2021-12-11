import { PageDef } from 'src/app/commun/page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { CLFUtile } from './c-l-f-utile';
import { Client } from '../client/client';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { CLFDoc } from './c-l-f-doc';
import { apiType, TypeCLF } from './c-l-f-type';
import { CLFLigne } from './c-l-f-ligne';
import { CommandePages } from 'src/app/client/commandes/commande-pages';
import { CLFDocs } from './c-l-f-docs';
import { CLFPages } from './c-l-f-pages';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ClientPages } from 'src/app/client/client-pages';
import { FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { FDocumentPages } from 'src/app/fournisseur/documents/f-document-pages';
import { Routeur } from 'src/app/commun/routeur';
import { CLFRouteur, LFRouteur } from './c-l-f-routeur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class CLFUtileUrl extends DataUtileUrl {
    constructor(utile: CLFUtile) {
        super(utile);
    }

    get utile(): CLFUtile {
        return this.parent as CLFUtile;
    }
    /**
     * Route racine des éditions
     */
    private routeurBase: CLFRouteur;
    private get lfRouteurBase(): LFRouteur { return this.routeurBase as LFRouteur; }

    /**
     * ISiteRoutes de la route: commande/bon ou (livraison ou facture)/client/:key/bon/:[NomParam.noDoc]
     */
    private routeurBon: Routeur;

    /**
     * ISiteRoutes de la route: document.
     */
    private routeurDocument: Routeur;

    /**
     * ISiteRoutes de la route: document pour le client ou document/client/:keyClient pour le fournisseur
     */
    private routeurDocumentClient: (keyClient?: IKeyUidRno) => Routeur;

    /**
     * Nécessaire pour toutes les urls d'édition.
     * Suffisant pour choixClient, client.
     * @param type type CLF des documents
     */
    fixeRouteBase(type: TypeCLF) {
        switch (type) {
            case 'commande':
                this.routeurBase = Fabrique.url.appRouteur.commande;
                break;
            case 'facture':
                this.routeurBase = Fabrique.url.appRouteur.facture;
                break;
            case 'livraison':
                this.routeurBase = Fabrique.url.appRouteur.livraison;
                break;
        }
    }

    /**
     * Nécessaire pour toutes les urls autres que choixClient, client, bons.
     * @param bon le bon
     */
    fixeRouteBon(bon: CLFDoc) {
        switch (bon.clfDocs.type) {
            case 'commande':
                this.routeurBase = Fabrique.url.appRouteur.commande;
                break;
            case 'livraison':
                this.routeurBase = Fabrique.url.appRouteur.livraison;
                this.lfRouteurBase.fixeBon(bon);
                break;
            case 'facture':
                this.routeurBase = Fabrique.url.appRouteur.facture;
                this.lfRouteurBase.fixeBon(bon);
                break;
        }
    }

    private _texteKeyLigne(ligne: CLFLigne): string {
        return ligne ? '' + ligne.no2 : undefined;
    }

    /**
     * Retourne une urlDef dont l'ISiteRoute est this.routeDoc:
     * commande/bon ou (livraison ou facture)/client/:key/bon/:[NomParam.noDoc]
     * @param pageDef si présent, le path est ajouté
     * @param ligne si présent, le texteKey est ajouté
     */
    private _urlDefDoc(pageDef?: PageDef, ligne?: CLFLigne) {
        const urlDef: IUrlDef = this.__urlDef(this.routeurBase.bon, pageDef, this._texteKeyLigne(ligne));
        return urlDef;
    }

    private _urlDefRetourLigne(pageDef: PageDef, ligne: CLFLigne) {
        const urlDef: IUrlDef = this.__urlDef(this.routeurBase.bon, pageDef, this._texteKeyLigne(ligne), true);
        return urlDef;
    }

    /**
     * Route: (livraison ou facture)/clients
     * Page de choix du client pour lequel on veut créer un document de synthèse.
     */
    choixClient(): IUrlDef {
        return this.__urlDef(this.routeurBase, CLFPages.choixClient);
    }

    /**
     * Route: (livraison ou facture)/clients
     * avec le texteKey du client en fragment.
     * @param keyClient key du client
     */
    retourDUnClient(keyClient: IKeyUidRno): IUrlDef {
        const urlDef = this.choixClient();
        urlDef.fragment = this.id(KeyUidRno.texteDeKey(keyClient));
        return urlDef;
    }

    /**
     * Route: (livraison ou facture)/client/:key
     * Lien vers la page titre contenant toutes les pages d'édition d'un document de synthèse.
     * @param client
     */
    client(client: Client): IUrlDef {
        this.lfRouteurBase.fixeClient(client);
        return this.__urlDef(this.routeurBase.client);
    }

    /**
     * Route: (livraison ou facture)/client/:key/bons
     * Url de la page de sélection des documents à synthétiser d'un client
     * @param client le client
     */
    bons(client: Client): IUrlDef {
        this.lfRouteurBase.fixeClient(client);
        return this.__urlDef(this.routeurBase.client, CLFPages.bons);
    }

    /**
     * Route: commande/bon ou (livraison ou facture)/client/:key/bon/:[NomParam.noDoc]
     * Url de la page titre contenant toutes les pages d'édition d'un document.
     * @param clfDoc si présent, routeDoc n'a pas été initialisé (cas des gardes)
     */
    bon(clfDoc?: CLFDoc): IUrlDef {
        if (clfDoc) {
            this.fixeRouteBon(clfDoc);
        }
        return this._urlDefDoc();
    }

    /**
     * Route: (livraison ou facture)/client/:key/bons
     * avec le no du bon en fragment
     * @param clfDoc bon qui est édité
     */
    retourDeBon(clfDoc: CLFDoc): IUrlDef {
        const urlDef = this.bons(clfDoc.client);
        return urlDef;
    }

    /**
     * Route: commande/contexte
     * Url de la page du contexte.
     */
    sitePasOuvert(): IUrlDef {
        return this.__urlDef(Fabrique.url.appRouteur.client, ClientPages.pasOuvert);
    }

    /**
     * Route: commande/bon
     * Url de la page du bon.
     */
    retourDeSitePasOuvert(): IUrlDef {
        return this.__urlDef(Fabrique.url.appRouteur.commande, CommandePages.bon);
    }

    /**
     * Route: livraison/client/:key/bon/0
     * Lien vers la page de création d'un bon de commande virtuel
     */
    bonVirtuel(client: Client): IUrlDef {
        this.lfRouteurBase.fixeClient(client);
        return this.__urlDef(this.routeurBase.client.enfant(CLFPages.bon.path, '0'));
    }

    /**
     * Route: commande/bon/lignes ou livraison/client/:key/bon/:[NomParam.noDoc]/lignes.
     * Url de la page titre contenant la page d'édition des lignes du bon.
     * @param clfDoc si présent, routeDoc n'a pas été initialisé (cas des gardes)
     */
    lignes(clfDoc?: CLFDoc): IUrlDef {
        if (clfDoc) {
            this.fixeRouteBon(clfDoc);
        }
        return this._urlDefDoc(CLFPages.lignes);
    }

    /**
     * Route: commande/bon/nouveau ou livraison/client/:key/bon/0/nouveau.
     * Url de la page titre contenant la page de création d'un bon de commande virtuel pour le fournisseur.
     * @param clfDoc si présent, routeDoc n'a pas été initialisé (cas des gardes)
     */
    nouveau(clfDoc: CLFDoc): IUrlDef {
        if (clfDoc) {
            this.fixeRouteBon(clfDoc);
        }
        return this._urlDefDoc(CLFPages.nouveau);
    }

    /**
     * Route: ./client/:key/envoi ou ./envoi pour les commandes
     * Url de la page de vérification et d'envoi d'un document.
     */
    envoi(clfDocs: CLFDocs): IUrlDef {
        this.fixeRouteBase(clfDocs.type);
        if (clfDocs.type === 'commande') {
            return this.__urlDef(this.routeurBase, CLFPages.envoi);
        }
        this.lfRouteurBase.fixeClient(clfDocs.client)
        return this.__urlDef(this.routeurBase.client, CLFPages.envoi);
    }
    retourDEnvoi(client?: Client): IUrlDef {
        if (client) {
            return this.bons(client);
        }
        return this.lignes();
    }

    /**
     * Route: routeBon/produit
     * Url de la page de choix du produit d'une ligne à ajouter à une commande.
     */
    choixProduit(): IUrlDef {
        return this._urlDefDoc(CLFPages.choixProduit);
    }
    retourDeAjoute(ligne: CLFLigne): IUrlDef {
        return this._urlDefRetourLigne(CLFPages.choixProduit, ligne);
    }
    ajoute(ligne: CLFLigne): IUrlDef {
        return this._urlDefDoc(CLFPages.ajoute, ligne);
    }
    supprime(ligne: CLFLigne): IUrlDef {
        return this._urlDefDoc(CLFPages.supprime, ligne);
    }

    retourLigne(ligne: CLFLigne): IUrlDef {
        return this._urlDefRetourLigne(CLFPages.lignes, ligne);
    }

    // dans le constructeur de FournisseurCLFService et ClientCLFService
    fixeRoutesDocument() {
        if (this.utile.utilisateurEstLeClient) {
            this.routeurDocument = Fabrique.url.appRouteur.client.enfant(ClientPages.documents.path);
            this.routeurDocumentClient = () => this.routeurDocument;
        } else {
            this.routeurDocument = Fabrique.url.appRouteur.fournisseur.enfant(FournisseurPages.documents.path);
            this.routeurDocumentClient = (keyClient: IKeyUidRno) => this.routeurDocument.enfant(
                FDocumentPages.clients.path, CLFPages.client.path, KeyUidRno.texteDeKey(keyClient));
        }
    }

    /**
     * Route: document/clients
     */
    clientsBilansDocs(): IUrlDef {
        return this.__urlDef(this.routeurDocument, FDocumentPages.clients)
    }

    /**
     * Route: document/clients avec le texteKey du client en fragment.
     * @param keyClient key du client
     */
    retourDUnClientVersBilansDocs(keyClient: IKeyUidRno): IUrlDef {
        const urlDef = this.clientsBilansDocs();
        urlDef.fragment = this.id(KeyUidRno.texteDeKey(keyClient));
        return urlDef;
    }

    /**
     * Route: document/cherche
     */
    cherche(): IUrlDef {
        return this.__urlDef(this.routeurDocument, FDocumentPages.cherche)
    }

    /**
     * Route: document/client/:key/liste (fournisseur) document/liste (client)
     * @param keyClient key du client
     */
    documentsClient(keyClient?: IKeyUidRno): IUrlDef {
        return this.__urlDef(this.routeurDocumentClient(keyClient), CLFPages.liste);
    }

    private documentPageDef(type: TypeCLF): PageDef {
        return type === 'commande' ? CLFPages.commande : type === 'livraison' ? CLFPages.livraison : CLFPages.facture;
    }

    /**
     * Route: document/client/:key/type/:no (fournisseur) document/type/:no (client)
     * @param clfDoc le document à afficher
     */
    document(clfDoc: CLFDoc): IUrlDef {
        return this.__urlDef(this.routeurDocumentClient(clfDoc), this.documentPageDef(clfDoc.type), '' + clfDoc.no);
    }

    /**
     * Id à utiliser dans la table des documents d'un client pour la ligne du document
     * @param clfDoc document à identifier
     */
    idDeDocument(clfDoc: CLFDoc): string {
        return apiType(clfDoc.type) + clfDoc.no;
    }

    /**
     * Route: document/client/:key/liste (fournisseur) document/liste (client) avec en fragment l'id du document
     * @param clfDoc document qui était affiché
     */
    retourDeDocument(clfDoc: CLFDoc): IUrlDef {
        const urlDef = this.documentsClient(clfDoc);
        urlDef.fragment = this.idDeDocument(clfDoc);
        return urlDef;
    }
}
