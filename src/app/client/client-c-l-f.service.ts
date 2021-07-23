import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ApiAction, ApiController } from 'src/app/api/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { concatMap, tap, map, switchMap } from 'rxjs/operators';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { Site } from 'src/app/modeles/site/site';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { CLFService } from 'src/app/modeles/c-l-f/c-l-f.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { ClientService } from 'src/app/modeles/client/client.service';
import { CLFDoc } from '../modeles/c-l-f/c-l-f-doc';
import { IdEtatSite } from '../modeles/etat-site';
import { ApiResult } from '../api/api-results/api-result';
import { ApiResult409Conflict } from '../api/api-results/api-result-409-conflict';
import { ApiDocumentsData } from '../modeles/c-l-f/api-documents-client-data';
import { Identifiant } from '../securite/identifiant';
import { Client } from '../modeles/client/client';
import { ContexteCatalogue } from './contexte-catalogue';
import { Catalogue } from '../modeles/catalogue/catalogue';
import { CLFFiltre } from '../modeles/c-l-f/c-l-f-filtre';
import { SiteService } from '../modeles/site/site.service';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { ClientUtile } from '../modeles/client/client-utile';

@Injectable({
    providedIn: 'root'
})
export class ClientCLFService extends CLFService {

    controllerUrl = 'commande';

    private pStockChargéSubject: Subject<CLFDocs>;

    constructor(
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService,
        private siteService: SiteService
    ) {
        super('CLFClient', catalogueService, stockageService, clientService, apiRequeteService);
        this.utile.utilisateurEstLeClient = true;
        this.pStockChargéSubject = new Subject<CLFDocs>();
        this.traiteErreur = this.traiteErreur409.bind(this);
    }

    get clientUtile(): ClientUtile {
        return this.clientService.utile;
    }

    /// SECTION Observables du stock

    /**
     * Avant la redirection d'un lien, on vérifie le contexte.
     * Si la date du catalogue du stock est antérieure à celle du contexte, on supprime le stock et on redirige
     * vers la page contexte avec un message d'avertissement et un bouton-lien qui recharge le stock et redirige
     * vers l
     *
     * Quand on envoie une requête action, la date du catalogue du stock est passée dans les params.
     * Si le catalogue du stock est obsolète, il faut annuler l'action envoi d'un bon de commande, permettre les autres actions.
     * Si une action est empêchée, elle retourne BadRequest avec les erreurs etatSite et dateCatalogue
     *
     * Si changé, on recharge les éléments nécessaires du stock
     * et on redirige vers la page Bon. Si c'est la page active, on emet un observable pour qu'elle recharge le stock.
     *
     * Resolver page Bon
     * Si la propriété stockChargé est définie, retourne ce stock et supprime la propriété
     * Sinon, charge et vérifie le contexte et, si changé, recharge les éléments nécessaires et retourne le stock
     *
     * Resolver autre page
     * Charge et vérifie le contexte et, si changé, recharge les éléments nécessaires du stock
     * Fixe une propriété stockChargé égale au stock ancien ou rechargé
     * Si le contexte n'a pas changé, retourne ce stock
     * Si le contexte a changé, redirige vers la page Bon
     * Si déjà sur la page Bon, le Resolver et ngOnInit ne sont pas appelés
     *
     * Si une action retourne l'erreur EtatChangé
     * Charge le contexte et les éléments nécessaires du stock
     * Fixe une propriété stockChargé
     * Redirige vers la page Bon
     *
     * Si déjà sur la page Bon, le Resolver et ngOnInit ne sont pas appelés
     * Il faut que le component souscrive à un observable qui emet quand stockChargé est fixé
     */

    stockChargéObs(): Observable<CLFDocs> {
        return this.pStockChargéSubject.asObservable();
    }

    /**
     * L'erreur 409 Conflict est retournée quand une requête Api émise par un client ne peut pas être exécutée
     * parce qu'une modification du catalogue est en cours ou a eu lieu depuis le chargement du site. L'objet
     * contenu dans l'erreur est un ClfDocs contexte
     * Le traitement de l'erreur met à jour, s'il a changé, l'état des site stockés, stocke le contexte et redirige vers la page Contexte.
     */
    get traiteErreur409(): (apiResult: ApiResult) => boolean {
        return (apiResult: ApiResult) => {
            if (apiResult.statusCode !== ApiResult409Conflict.code) {
                // ce n'est pas une erreur du contexte
                return false;
            }
            // une modification du catalogue est en cours ou a eu lieu depuis le chargement du stock
            const contexte: ContexteCatalogue = (apiResult as ApiResult409Conflict).erreur as ContexteCatalogue;
            const site = this.navigation.litSiteEnCours();
            // le site en mémoire était d'état ouvert quand la requête a été émise
            if (contexte.etatSite === IdEtatSite.catalogue) {
                // l'état du site a changé depuis le chargement du site
                site.etat = IdEtatSite.catalogue;
                this.navigation.fixeSiteEnCours(site);
                this.identification.fixeSiteIdentifiant(site);
            }
            const clfDocs = new CLFDocs();
            clfDocs.type = 'commande';
            clfDocs.site = site;
            clfDocs.catalogue = Catalogue.deDate(contexte.dateCatalogue);
            this.fixeStock(clfDocs);
            const urlDef = this.utile.url.sitePasOuvert();
            urlDef.params = [{ nom: 'err', valeur: '409' }];
            this.routeur.navigueUrlDef(urlDef);
            return true;
        }
    }

    /**
     * Le CLFDocs lu dans l'Api.
     * Si le site est d'état Catalogue, retourne un contexte Catalogue: état site = Catalogue, date catalogue = DateNulle.
     * Si le site est ouvert et si l'utilisateur a passé la date de son catalogue
     * et si la date du catalogue utilisateur est postérieure à celle du catalogue de la bdd, les données utilisateur sont à jour,
     * retourne un contexte Ok: état site = ouvert, date catalogue = DataNulle.
     * Si le site est ouvert et si l'utilisateur a passé la date de son catalogue
     * et si la date du catalogue utilisateur est antérieure à celle du catalogue de la bdd
     * retourne un contexte Périmé: état site = ouvert, date catalogue = celle du catalogue de la bdd.
     * Si le site est ouvert et si l'utilisateur n'a pas passé la date de son catalogue, il n'y pas de données utilisateur,
     * retourne un CLFDocs dont le champ Documents contient les données pour client de la dernière commande du client
     * Pas stocké.
     */
    private litClfDocs(controller: string, action: string, params: { [param: string]: string }): Observable<CLFDocs> {
        const clfDocs$: Observable<CLFDocs> = this.lectureObs<ApiDocumentsData>({
            demandeApi: () => this.get<ApiDocumentsData>(controller, action, params),
            traiteErreur: this.traiteErreur409
        }).pipe(
            map(datas => {
                const clfDocs = new CLFDocs();
                clfDocs.charge(datas);
                return clfDocs;
            })
        );
        return clfDocs$;
    }

    /**
     * Charge le contexte.
     * Si site pas ouvert ou catalogue périmé, stocke le contexte et redirige vers ./contexte.
     * Sinon, si le stock n'existe pas ou est un contexte, charge et stocke le cflDocs
     */
    private clfDocsDeBon(): Observable<CLFDocs> {
        const site: Site = this.navigation.litSiteEnCours();
        const identifiant: Identifiant = this.identification.litIdentifiant();
        const client: Client = identifiant.roleParUrl(site.url) as Client;
        const keyIdentifiant = {
            uid: client.uid,
            rno: client.rno
        };
        const stock = this.litStockSiExistant();
        const params = KeyUidRno.créeParams(keyIdentifiant);
        // si le stock existe et n'est pas un contexte résultant d'une erreur 409 précédente
        // il faut vérifier qu'il est à jour.
        if (stock && !stock.estContexte) {
            params.dateCatalogue = '' + stock.catalogue.date;
        }
        // Si le site est d'état Catalogue
        //  retourne l'erreur 409 avec contexte Catalogue: état site = Catalogue, date catalogue = null.
        // Sinon,
        //  si le stock existe, la date du catalogue du stock est passée en paramètre
        //      si la date du catalogue du stock est antérieure à celle du catalogue de la bdd
        //          retourne l'erreur 409 avec contexte Périmé: état site = ouvert, date catalogue = celle du catalogue de la bdd
        //      sinon, le stock est à jour,
        //          retourne un ClfDocs vide
        // sinon
        //      retourne un CLFDocs dont le champ Documents contient les données pour client de la dernière commande du client
        // Si le site est d'état Catalogue, retourne un contexte Catalogue: état site = Catalogue, date catalogue = null.
        // Si le site est ouvert et si l'utilisateur a passé la date de son catalogue
        // et si la date du catalogue utilisateur est postérieure à celle du catalogue de la bdd, les données utilisateur sont à jour,
        // retourne un contexte Ok: état site = ouvert, date catalogue = DataNulle.
        // Si le site est ouvert et si l'utilisateur a passé la date de son catalogue
        // et si la date du catalogue utilisateur est antérieure à celle du catalogue de la bdd
        // retourne un contexte Périmé: état site = ouvert, date catalogue = celle du catalogue de la bdd.
        // Si le site est ouvert et si l'utilisateur n'a pas passé la date de son catalogue, il n'y pas de données utilisateur,
        // retourne un CLFDocs dont le champ Documents contient les données pour client de la dernière commande du client
        return this.lectureObs<ApiDocumentsData>({
            demandeApi: () => this.get<ApiDocumentsData>(ApiController.commande, ApiAction.bon.encours, params),
            traiteErreur: this.traiteErreur409
        }).pipe(
            concatMap(datas => {
                if (!datas.documents) {
                    // l'ApiDocumentsData retourné est vide donc le stock existe et et à jour
                    return of(stock);
                }
                const clfDocs = new CLFDocs();
                clfDocs.type = 'commande';
                clfDocs.site = site;
                clfDocs.client = client;
                clfDocs.documents = datas.documents;
                const tarifs = clfDocs.documents.filter(d => !!d.tarif).map(d => d.tarif);
                return this.catalogueService.disponiblesAvecPrixDatés(site, tarifs).pipe(
                    map(catalogue => {
                        clfDocs.catalogue = catalogue;
                        this.fixeStock(clfDocs);
                        return clfDocs;
                    })
                );
            })
        );
    }

    /**
     * Lit l'état du site en cours dans la bdd et si changé, met à jour les stockages du site
     * et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
     * et si le site a réouvert, affiche une fenêtre modale  d'information.
     * @returns of(true)
     */
    litEtatSiteEtRetourneTrue(): boolean | Observable<boolean> {
        const site = this.navigation.litSiteEnCours();
        return this.siteService.litEtat().pipe(
            switchMap(état => {
                if (état === site.etat) {
                    // site n'a pas changé même si le stockage a été mis à jour
                    return of(true);
                }
                if (état === IdEtatSite.ouvert) {
                    const defs: { titre: string, textes: string[] } = this.clientUtile.textesEtatSite(IdEtatSite.ouvert)
                    const infos: KfComposant[] = [];
                    let étiquette: KfEtiquette;
                    defs.textes.forEach(texte => {
                        étiquette = Fabrique.ajouteEtiquetteP(infos);
                        étiquette.ajouteTextes(texte);
                    });
                    const modal = Fabrique.infoModal(defs.titre, infos);
                    return this.modalService.confirme(modal);
                } else {
                    this.catalogueService.fixeStock(null);
                    const clfDocs = new CLFDocs();
                    clfDocs.type = 'commande';
                    clfDocs.site = site;
                    clfDocs.catalogue = Catalogue.deDate();
                    this.fixeStock(clfDocs);
                    this.routeur.navigueUrlDef(this.utile.url.sitePasOuvert());
                }
                return of(true);
            })
        );
    }

    /**
     * Charge le contexte.
     * Si site pas ouvert ou catalogue périmé, stocke le contexte et redirige vers ./contexte.
     * Sinon, si le stock n'existe pas ou est un contexte, charge et stocke le cflDocs
     */
    gardePageBon(): Observable<boolean> {
        return this.clfDocsDeBon().pipe(
            map(clfDocs => {
                return clfDocs !== null;
            })
        );
    }

    /**
     * Garde si le stock existe et est un contexte.
     * Redirige vers bon sinon
     */
    gardeContexte(): boolean {
        const stock = this.litStock();
        if (stock && stock.estContexte) {
            return true;
        }
        // Pas de boucle contexte->bon->contexte
        this.routeur.navigueUrlDef(this.utile.url.bon());
        return false;
    }

    /**
     * Le stock existe car gardePageBon garde aussi envoi
     * retourne vrai si le document est prêt à l'envoi
     */
    gardeEnvoi(): Observable<boolean> {
        return this.clfDocsDeBon().pipe(
            map(clfDocs => {
                if (clfDocs) {
                    const apiDoc = clfDocs.documents[0];
                    return !apiDoc.date && apiDoc.lignes.length > 0;
                }
                return false;
            })
        );
    }

    /**
     * La garde a laissé passer donc le stock est à jour
     * Lit le stock. Crée le cflDoc.
     */
    résoudPageBon(): CLFDoc {
        const clfDocs = this.litStock();
        return clfDocs.créeBon();
    }
    /**
     * La garde a laissé passer donc le stock est un contexte
     * Lit le stock.
     */
    résoudContexte(): CLFDocs {
        return this.litStock();
    }

    /**
     * La garde a laissé passer donc le stock est à jour
     */
    résoudProduit(noString: string): Produit {
        const stock = this.litStock();
        const produit: Produit = stock.produit(noString);
        if (produit) {
            return produit;
        }
        this.routeur.navigueUrlDef(this.utile.url.bon());
    }

    /// FIN SECTION Observables du stock

    // API

    protected _paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string } {
        const stock = this.litStock();
        params.dateCatalogue = '' + stock.catalogue.date;
        return params;
    }

    /**
     * Le CLFDocs lu dans l'Api contient les listes des résumés des documents du client avec leur type.
     * Le CLFDocs retourné contient le Client du client.
     * Pas stocké.
     */
    documents(): Observable<CLFDocs> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const client: Client = identifiant.roleParUrl(site.url) as Client;
        const controller = ApiController.document;
        const action = ApiAction.document.client;
        if (!this.pFiltre || this.pFiltre.uid !== client.uid || this.pFiltre.rno !== client.rno) {
            this.pFiltre = new CLFFiltre(client);
        }
        return this._clfDocs$(site, controller, action, this.pFiltre.créeParams()).pipe(
            tap(clfDocs => {
                clfDocs.site = site;
                clfDocs.client = client;
            })
        );
    }

}
