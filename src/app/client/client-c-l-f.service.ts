import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ApiAction, ApiController } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { mergeMap, switchMap, concatMap, tap, map } from 'rxjs/operators';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { Site } from 'src/app/modeles/site/site';
import { ClientPages, ClientRoutes } from './client-pages';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { CLFService } from 'src/app/modeles/c-l-f/c-l-f.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { ClientService } from 'src/app/modeles/client/client.service';
import { ApiErreur400Traite } from 'src/app/commun/api-results/api-erreur-400';
import { CLFDoc } from '../modeles/c-l-f/c-l-f-doc';
import { IdEtatSite } from '../modeles/etat-site';

@Injectable({
    providedIn: 'root'
})
export class ClientCLFService extends CLFService {

    controllerUrl = 'commande';

    protected pStockage: Stockage<CLFDocs>;
    private pStockChargéSubject: Subject<CLFDocs>;


    constructor(
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(catalogueService, stockageService, clientService, apiRequeteService);
        this.pStockage = stockageService.nouveau<CLFDocs>('Commander', {
            rafraichit: 'rafraichi',
            avecDate: true
        });
        this.utile.utilisateurEstLeClient = true;
        this.pStockChargéSubject = new Subject<CLFDocs>();
        this.siDoitRecharger = ((contenuARecharger: any) => this.siErreurEtatChangé(contenuARecharger)).bind(this);
    }

    /// SECTION Surcharges de CommandeService


    /// FIN SECTION Surcharges de CommandeService

    /// SECTION Observables du stock

    /**
     * Avant la redirection d'un lien, on vérifie le contexte.
     * Si la date du catalogue du stock est antérieure à celle du contexte, on supprime le stock et on redirige
     * vers la page contexte avec un message d'avertissement et un bouton-lien qui recharge le stock et redirige
     * vers l
     *
     * Quand on envoie une requête action, la date du catalogue du stock est passée dans les params.
     * Si le catalogue du stock est obsolète, il faut annuler l'action envoi d'un bon de commande, permettre les autres actions.
     * Si une action est empéchée, elle retourne BadRequest avec les erreurs etatSite et dateCatalogue
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

    private _litContexte$(keyClient: KeyUidRno): Observable<CLFDocs> {
        return this.litClfDocs(ApiController.commande, ApiAction.commande.contexte, KeyUidRno.créeParams(keyClient));
    }

    private _litDocuments$(site: Site, keyClient: IKeyUidRno): Observable<CLFDocs> {
        let clfDocs$ = this.litClfDocs(ApiController.commande, ApiAction.commande.encours, KeyUidRno.créeParams(keyClient)).pipe(
            tap(clfDocs => {
                clfDocs.type = 'commande';
                this.fixeSiteEtIdentifiant(clfDocs, site, keyClient);
            }));
        clfDocs$ = this._fixeClient$(clfDocs$, keyClient, true);
        return this._fixeCatalogue$(clfDocs$);
    }

    /**
     * Vérifie l'état du site et la date du catalogue
     * @param mêmeSiPasChangé si présent, le stock est rechargé même s'il semble à jour
     */
    chargeEtVérifie(mêmeSiPasChangé?: 'mêmeSiPasChangé'): Observable<{
        stock: CLFDocs,
        changé: boolean,
        siteChangé?: Site
    }> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyIdentifiant = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };

        return this._litContexte$(keyIdentifiant).pipe(
            concatMap((contexte: CLFDocs) => {
                const stock = this.litStock();
                let changé: boolean;
                let siteChangé: Site;
                if (site.etat !== contexte.site.etat) {
                    site.etat = contexte.site.etat;
                    changé = true;
                    siteChangé = site;
                } else {
                    changé = mêmeSiPasChangé !== undefined
                        || !stock
                        || stock.type !== 'commande'
                        || !stock.catalogue
                        || stock.catalogue.date !== contexte.catalogue.date; // date du catalogue changé
                }

                if (changé) {
                    return this._litDocuments$(site, keyIdentifiant).pipe(
                        mergeMap(documents => {
                            return of({ stock: documents, changé: true, siteChangé });
                        })

                    );
                }
                return of({ stock, changé: false, siteChangé });
            }));
    }

    metAJourSitesStockés(site: Site) {
        if (site) {
            this.navigation.fixeSiteEnCours(site);
            this.identification.fixeSiteIdentifiant(site);
        }
    }

    /**
     * Charge le contexte.
     * Si site pas ouvert ou catalogue périmé, stocke le contexte et redirige vers ./contexte.
     * Sinon, si le stock n'existe pas ou est un contexte, charge et stocke le cflDocs
     */
    gardePageBon(): Observable<boolean> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyIdentifiant = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };

        return this._litContexte$(keyIdentifiant).pipe(
            concatMap((contexte: CLFDocs) => {
                if (site.etat !== contexte.site.etat) {
                    site.etat = contexte.site.etat;
                    this.navigation.fixeSiteEnCours(site);
                    this.identification.fixeSiteIdentifiant(site);
                }
                if (contexte.site.etat !== IdEtatSite.ouvert) {
                    this.fixeStock(contexte);
                    return of(false);
                }
                const stock = this.litStock();
                if (stock && !stock.estContexte && stock.catalogue.date !== contexte.catalogue.date) {
                    this.fixeStock(contexte);
                    return of(false);
                }
                if (stock && !stock.estContexte) {
                    return of(true);
                }
                return this._litDocuments$(site, keyIdentifiant).pipe(
                    map((clfDocs: CLFDocs) => {
                        this.fixeStock(clfDocs);
                        return !clfDocs.estContexte;
                    })
                );
            })
        );
    }

    /**
     * retourne vrai si le stock existe et est un contexte
     */
    gardeContexte(): boolean {
        const stock = this.litStock();
        return stock && stock.estContexte;
    }

    /**
     * Le stock existe car gardePageBon garde aussi envoi
     * retourne vrai si le document est prêt à l'envoi
     */
    gardeEnvoi(): boolean {
        const stock = this.litStock();
        const apiDoc = stock.documents[0];
        return !apiDoc.date && apiDoc.lignes.length > 0;
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

    /**
     * Appelé si une action API n'a pas pu aboutir parce que une modification du catalogue est en cours ou a eu lieu
     * depuis le chargement du stock.
     */
    siErreurEtatChangé(contexte: CLFDocs): void {
        const site = this.navigation.litSiteEnCours();
        if (site.etat !== contexte.site.etat) {
            site.etat = contexte.site.etat;
            this.navigation.fixeSiteEnCours(site);
            this.identification.fixeSiteIdentifiant(site);
        }
        contexte.type = 'commande';
        this.fixeStock(contexte);
        const urlDef = this.utile.url.contexte();
        urlDef.params = [{ nom: 'err', valeur: '409' }];
        this.routeur.navigueUrlDef(urlDef);
    }

    private _vérifieStock$(contexte: CLFDocs, site: Site, keyIdentifiant: IKeyUidRno): Observable<{
        stock: CLFDocs,
        changé: boolean
    }> {
        const stock = this.litStock();
        let changé: boolean;
        if (site.etat !== contexte.site.etat) {
            site.etat = contexte.site.etat;
            this.navigation.fixeSiteEnCours(site);
            this.identification.fixeSiteIdentifiant(site);
            changé = true;
        } else {
            changé = !stock
                || !KeyUidRno.compareKey(stock.site, site) // site changé
                || !KeyUidRno.compareKey(stock.keyIdentifiant, keyIdentifiant) // identifiant changé
                || stock.catalogue.date !== contexte.catalogue.date; // date du catalogue changé
        }

        if (changé) {
            return this._litDocuments$(site, keyIdentifiant).pipe(
                mergeMap(documents => {
                    return of({ stock: documents, changé: true });
                })

            );
        }
        return of({ stock, changé: false });
    }

    /**
     * appelé par les resolvers de accueil et bon
     */
    stock$(): Observable<CLFDocs> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyIdentifiant = {
            uid: identifiant.uid,
            rno: identifiant.roleNo(site)
        };

        const contexte$ = this._litContexte$(keyIdentifiant);
        const stockChangé$ = contexte$.pipe(
            concatMap((contexte: CLFDocs) => this._vérifieStock$(contexte, site, keyIdentifiant))
        );
        const stock$ = stockChangé$.pipe(
            switchMap(stockChangé => {
                const stock = stockChangé.stock;
                if (stockChangé.changé) {
                    this.pStockage.fixeStock(stock);
                }
                return of(stock);
            })
        );

        return stock$;
    }

    /// FIN SECTION Observables du stock

    // API

    protected _paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string } {
        const stock = this.litStock();
        params.dateCatalogue = '' + stock.catalogue.date;
        return params;
    }

    /**
     * si une soumission a retourné l'erreur EtatChange, efface le stock et redirige vers accueil
     */
    private _actionSiErreur(groupe: KfGroupe) {
        const errors = groupe.formGroup.errors;
        if (errors && Object.keys(errors).find(k => k.toLowerCase() === 'EtatChange'.toLowerCase())) {
            // l'utilisateur est le client
            this.pStockage.initialise();
            const site = this.navigation.litSiteEnCours();
            // la route est celle des pages du client
            this.routeur.naviguePageDef(ClientPages.commandes, ClientRoutes, site.nomSite);
        }
    }

}
