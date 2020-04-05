import { PageDef } from 'src/app/commun/page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { ISiteRoutes, iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { CLFUtile } from './c-l-f-utile';
import { Client } from '../client/client';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { CLFDoc } from './c-l-f-doc';
import { TypeCLF } from './c-l-f-type';
import { CLFLigne } from './c-l-f-ligne';
import { LivraisonRoutes } from 'src/app/fournisseur/livraisons/livraison-pages';
import { CommandeRoutes, CommandePages } from 'src/app/client/commandes/commande-pages';
import { CLFDocs } from './c-l-f-docs';
import { FactureRoutes } from 'src/app/fournisseur/factures/facture-pages';
import { CLFPages } from './c-l-f-pages';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ClientRoutes } from 'src/app/client/client-pages';
import { ClientPages } from 'src/app/client/client-pages';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { KeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ValeurTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';

export class CLFUtileUrl extends DataUtileUrl {

    constructor(utile: CLFUtile) {
        super(utile);
    }

    get utile(): CLFUtile {
        return this._parent as CLFUtile;
    }

    /**
     * Route racine des éditions
     */
    private routeBase: ISiteRoutes;
    private routeClient: (client?: Client) => ISiteRoutes;
    /**
     * Retourne l'ISiteRoutes de la route: commande/bon ou (livraison ou facture)/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]
     */
    private routeDocFnc: (clfDoc: CLFDoc) => ISiteRoutes;
    /**
     * ISiteRoutes de la route: commande/bon ou (livraison ou facture)/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]
     */
    private routeDoc: ISiteRoutes;

    /**
     * Nécessaire pour toutes les urls.
     * Suffisant pour choixClient, client.
     * @param type type CLF des documents
     */
    fixeRouteBase(type: TypeCLF) {
        switch (type) {
            case 'commande':
                this.routeBase = CommandeRoutes;
                this.routeClient = () => CommandeRoutes;
                break;
            case 'facture':
                this.routeBase = FactureRoutes;
                this.routeClient =
                    (client: Client) => iSiteRoutePlusSegments(FactureRoutes, [CLFPages.client.urlSegment, KeyUidRno.texteDeKey(client)]);
                break;
            case 'livraison':
                this.routeBase = LivraisonRoutes;
                this.routeClient =
                    (client: Client) => iSiteRoutePlusSegments(LivraisonRoutes, [CLFPages.client.urlSegment, KeyUidRno.texteDeKey(client)]);
                break;
        }
    }

    /**
     * Nécessaire pour toutes les urls autres que choixClient, client, bons.
     * @param clfDoc le bon
     */
    fixeRouteDoc(clfDoc: CLFDoc) {
        this.fixeRouteBase(clfDoc.clfDocs.type);
        switch (clfDoc.clfDocs.type) {
            case 'commande':
                this.routeDoc = iSiteRoutePlusSegments(CommandeRoutes, [CLFPages.bon.urlSegment]);
                break;
            case 'livraison':
            case 'facture':
                this.routeDoc = iSiteRoutePlusSegments(this.routeClient(clfDoc.client), [CLFPages.bon.urlSegment, '' + clfDoc.no]);
                break;
        }
    }

    fixeRouteCommande() {
        this.routeBase = CommandeRoutes;
        this.routeDoc = iSiteRoutePlusSegments(CommandeRoutes, [CLFPages.bon.urlSegment]);
    }

    private _texteKeyLigne(ligne: CLFLigne): string {
        return ligne ? '' + ligne.no2 : undefined;
    }

    /**
     * Retourne une urlDef dont l'ISiteRoute est this.routeDoc:
     * commande/bon ou (livraison ou facture)/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]
     * @param pageDef si présent, l'urlSegment est ajouté
     * @param ligne si présent, le texteKey est ajouté
     */
    private _urlDefDoc(pageDef?: PageDef, ligne?: CLFLigne) {
        const urlDef: IUrlDef = this.__urlDef(this.routeDoc, pageDef, this._texteKeyLigne(ligne));
        return urlDef;
    }

    private _urlDefRetourLigne(pageDef: PageDef, ligne: CLFLigne) {
        const urlDef: IUrlDef = this.__urlDef(this.routeDoc, pageDef, this._texteKeyLigne(ligne), true);
        return urlDef;
    }

    /**
     * Route: (livraison ou facture)/clients
     * Page de choix du client pour lequel on veut créer un document de synthèse.
     */
    choixClient(): IUrlDef {
        return this.__urlDef(this.routeBase, CLFPages.choixClient);
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
     * Route: (livraison ou facture)/client/:[nomParamKeyClient]
     * Lien vers la page titre contenant toutes les pages d'édition d'un document de synthèse.
     * @param clfDocs contient le client et ses documents à synthétiser et s'il n'y en a pas la dernière synthèse.
     */
    client(clfDocs: CLFDocs): IUrlDef {
        return this.__urlDef(this.routeClient(clfDocs.client));
    }

    /**
     * Route: (livraison ou facture)/client/:[nomParamKeyClient]/bons
     * Url de la page de sélection des documents à synthétiser d'un client
     * @param client le client
     */
    bons(client: Client): IUrlDef {
        return this.__urlDef(this.routeClient(client), CLFPages.bons);
    }

    /**
     * Route: commande/bon ou (livraison ou facture)/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]
     * Url de la page titre contenant toutes les pages d'édition d'un document.
     * @param clfDoc si présent, routeDoc n'a pas été initialisé (cas des gardes)
     */
    bon(clfDoc?: CLFDoc): IUrlDef {
        if (clfDoc) {
            this.fixeRouteDoc(clfDoc);
        }
        return this._urlDefDoc();
    }

    /**
     * Route: (livraison ou facture)/client/:[nomParamKeyClient]/bons
     * avec le no du bon en fragment
     * @param clfDoc bon qui est édité
     */
    retourDeBon(clfDoc: CLFDoc): IUrlDef {
        const urlDef = this.bons(clfDoc.client);
        urlDef.fragment = this.id('' + clfDoc.no);
        return urlDef;
    }

    /**
     * Route: commande/contexte
     * Url de la page du contexte.
     */
    contexte(): IUrlDef {
        return this.__urlDef(CommandeRoutes, CommandePages.contexte);
    }

    /**
     * Route: commande/bon
     * Url de la page du bon.
     */
    retourDeContexte(): IUrlDef {
        return this.__urlDef(CommandeRoutes, CommandePages.bon);
    }

    /**
     * Route: livraison/client/:[nomParamKeyClient]/bon/0
     * Lien vers la page de création d'un bon de commande virtuel
     */
    bonVirtuel(client: Client): IUrlDef {
        const route = iSiteRoutePlusSegments(this.routeClient(client), [CLFPages.bon.urlSegment, '0']);
        return this.__urlDef(route);
    }
    routeBonVirtuel(client: Client): string {
        const def = this.bonVirtuel(client);
        return def.routes.url(ValeurTexteDef(def.nomSite), [CLFPages.nouveau.urlSegment]);
    }

    /**
     * Route: commande/bon/lignes ou livraison/client/:[nomParamKeyClient]/bon/:[nomParamNoDoc]/lignes.
     * Url de la page titre contenant la page d'édition des lignes du bon.
     * @param clfDoc si présent, routeLignes n'a pas été initialisé (cas des gardes)
     */
    lignes(clfDoc?: CLFDoc): IUrlDef {
        if (clfDoc) {
            this.fixeRouteDoc(clfDoc);
        }
        return this._urlDefDoc(CLFPages.lignes);
    }

    /**
     * Route: commande/bon/nouveau ou livraison/client/:[nomParamKeyClient]/bon/0/nouveau.
     * Url de la page titre contenant la page de création d'un bon de commande virtuel pour le fournisseur.
     * @param clfDoc si présent, routeLignes n'a pas été initialisé (cas des gardes)
     */
    nouveau(clfDoc?: CLFDoc): IUrlDef {
        if (clfDoc) {
            this.fixeRouteDoc(clfDoc);
        }
        return this._urlDefDoc(CLFPages.nouveau);
    }

    /**
     * Route: ./client/:[nomParamKeyClient]/envoi ou ./envoi pour les commandes
     * Url de la page de vérification et d'envoi d'un document.
     */
    envoi(clfDocs: CLFDocs): IUrlDef {
        this.fixeRouteBase(clfDocs.type);
        return this.__urlDef(this.routeClient(clfDocs.client), CLFPages.envoi);
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

    private get routeDocuments(): ISiteRoutes {
        let route: ISiteRoutes;
        let pageDef: PageDef;
        if (this.utile.utilisateurEstLeClient) {
            route = ClientRoutes;
            pageDef = ClientPages.documents;
        } else {
            route = FournisseurRoutes;
            pageDef = FournisseurPages.documents;
        }
        return iSiteRoutePlusSegments(route, [pageDef.urlSegment]);
    }

    private paramDocument(clfDoc: CLFDoc): string {
        if (this.utile.utilisateurEstLeClient) {
            return '' + clfDoc.no;
        } else {
            return KeyUidRnoNo.texteDeKey(clfDoc);
        }
    }

    document(clfDoc: CLFDoc): IUrlDef {
        const pageDef = clfDoc.type === 'commande'
            ? CLFPages.commande
            : clfDoc.type === 'livraison'
                ? CLFPages.livraison
                : CLFPages.facture;
        const param = this.paramDocument(clfDoc);
        return this.__urlDef(this.routeDocuments, pageDef, param);
    }
    idDeDocument(clfDoc: CLFDoc): string {
        return clfDoc.type + ' ' + this.paramDocument(clfDoc);
    }
    retourDeDocument(clfDoc: CLFDoc): IUrlDef {
        const urlDef = this.__urlDef(this.routeDocuments, CLFPages.liste);
        urlDef.fragment = this.idDeDocument(clfDoc);
        return urlDef;
    }
}
