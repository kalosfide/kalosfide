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
import { DATE_EST_NULLE } from '../modeles/date-nulle';

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
        const stock = this.litStock();
        const params = KeyUidRno.créeParams(keyIdentifiant);
        if (stock && !stock.estContexte) {
            params.dateCatalogue = '' + stock.catalogue.date;
        }
        // si le stock existe avec un catalogue à jour et si le site est toujours ouvert, retourne un contexte ayant une date nulle
        return this.litClfDocs(ApiController.commande, ApiAction.commande.encours, params).pipe(
            map(lu => {
                const cflDocs = new CLFDocs();
                cflDocs.copie(lu);
                if (cflDocs.estContexte) {
                    if (site.etat !== cflDocs.site.etat) {
                        site.etat = cflDocs.site.etat;
                        this.navigation.fixeSiteEnCours(site);
                        this.identification.fixeSiteIdentifiant(site);
                    }
                    if (cflDocs.site.etat !== IdEtatSite.ouvert || !DATE_EST_NULLE(cflDocs.catalogue.date)) {
                        this.fixeStock(cflDocs);
                        return { contexte: cflDocs, clfDocs: undefined };
                    } else {
                        // le stock est toujours à jour
                        return { contexte: undefined, clfDocs: cflDocs };
                    }
                } else {
                    // le stock n'existait pas ou était un contexte ou avait un catalogue devenu obsolete
                    return { contexte: cflDocs, clfDocs: cflDocs };
                }
            }),
            mergeMap(result => {
                if (!result.contexte) {
                    return of(true);
                }
                if (!result.clfDocs) {
                    this.fixeStock(result.contexte);
                    this.routeur.navigueUrlDef(this.utile.url.contexte());
                    return of(false);
                }
                result.clfDocs.type = 'commande';
                this.fixeSiteEtIdentifiant(result.clfDocs, site, keyIdentifiant);
                return this._fixeCatalogue$(this._fixeClient$(of(result.clfDocs), keyIdentifiant, true)).pipe(
                    map(cLFDocs => {
                        this.fixeStock(cLFDocs);
                        return true;
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
    gardeEnvoi(): Observable<boolean> {
        return this.gardePageBon().pipe(
            map(gardé => {
                if (gardé) {
                    const stock = this.litStock();
                    const apiDoc = stock.documents[0];
                    gardé = !apiDoc.date && apiDoc.lignes.length > 0;
                }
                return gardé;
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
