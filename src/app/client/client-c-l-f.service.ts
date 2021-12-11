import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ApiAction, ApiController } from 'src/app/api/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { Site } from 'src/app/modeles/site/site';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { CLFService } from 'src/app/modeles/c-l-f/c-l-f.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { ClientService } from 'src/app/modeles/client/client.service';
import { CLFDoc } from '../modeles/c-l-f/c-l-f-doc';
import { ApiResult } from '../api/api-results/api-result';
import { ApiResult409Conflict } from '../api/api-results/api-result-409-conflict';
import { ApiDocs } from '../modeles/c-l-f/api-docs';
import { ContexteCatalogue } from './contexte-catalogue';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { ClientUtile } from '../modeles/client/client-utile';
import { UrlTree } from '@angular/router';
import { ApiResult200Ok } from '../api/api-results/api-result-200-ok';
import { Client } from '../modeles/client/client';

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
    ) {
        super('CLFClient', catalogueService, stockageService, clientService, apiRequeteService);
        this.utile.utilisateurEstLeClient = true;
        this.utile.url.fixeRoutesDocument();
        this.pStockChargéSubject = new Subject<CLFDocs>();
        this.traiteErreur = this.traiteErreur409.bind(this);
    }

    get clientUtile(): ClientUtile {
        return this.clientService.utile;
    }

    /**
     * Lit l'état du site en cours dans la bdd et si changé, met à jour les stockages du site
     * et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
     * et si le site a réouvert, affiche une fenêtre modale  d'information.
     * @returns of(true)
     */
    litEtatSiteEtRetourneTrue(): Observable<boolean> {
        const site = this.litSiteEnCours();
        return this.catalogueService.contexteChangé(site).pipe(
            switchMap(changé => {
                if (!changé) {
                    return of(true);
                }
                // la variable site a été modifié
                if (site.ouvert) {
                    const defs: { titre: string, textes: string[] } = this.clientUtile.textesEtatSite(true)
                    const infos: KfComposant[] = [];
                    let étiquette: KfEtiquette;
                    defs.textes.forEach(texte => {
                        étiquette = Fabrique.ajouteEtiquetteP(infos);
                        étiquette.ajouteTextes(texte);
                    });
                    const modal = Fabrique.infoModal(defs.titre, infos, 'success');
                    return this.modalService.confirme(modal);
                } else {
                    this.catalogueService.fixeStock(null);
                    const clfDocs = new CLFDocs();
                    clfDocs.type = 'commande';
                    clfDocs.site = site;
                    this.fixeStock(clfDocs);
                    this.routeur.navigueUrlDef(this.utile.url.sitePasOuvert());
                }
                return of(true);
            })
        );
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
     * Le traitement de l'erreur met à jour, s'il a changé, l'état des site stockés, stocke le contexte.
     */
    get traiteErreur409(): (apiResult: ApiResult) => boolean {
        return (apiResult: ApiResult) => {
            if (apiResult.statusCode !== ApiResult409Conflict.code) {
                // ce n'est pas une erreur du contexte
                return false;
            }
            // une modification du catalogue est en cours ou a eu lieu depuis le chargement du stock
            const contexte: ContexteCatalogue = (apiResult as ApiResult409Conflict).erreur as ContexteCatalogue;
            const site = this.litSiteEnCours();
            // le site en mémoire était d'état ouvert quand la requête a été émise
            if (contexte.ouvert) {
                // la modification du catalogue a eu lieu et la date du catalogue a changé depuis le chargement du site
                site.dateCatalogue = contexte.dateCatalogue;
            } else {
                // une modification du catalogue est en cours
                site.ouvert = false;
            }
            this.identification.fixeSite(site);
            const clfDocs = new CLFDocs();
            clfDocs.type = 'commande';
            clfDocs.site = site;
            this.fixeStock(clfDocs);
            return true;
        }
    }

    /**
     * Crée et stocke un ClfDocs qui contient le document en cours ou est un contexte avec l'état du site et la date du catalogue.
     * Si le site est fermé, le ClfDocs stocké est le contexte { état: Catalogue, date: null }.
     * Si le site est ouvert, si le stock existait et n'était pas un contexte, il est remplacé par le contexte
     * { état: Ouvert, date du catalogue de la bdd } s'il est périmé.
     * Si le site est ouvert, si le stock n'existait pas ou était un contexte, le ClfDocs stocké contient le document en cours.
     * @returns un Observable qui émet true ou l'UrlTree de la page pasOuvert si le ClfDocs stocké est un contexte
     */
    chargeDocumentOuContexte(): Observable<boolean | UrlTree> {
        const role = this.identification.roleEnCours;
        const site: Site = role.site;
        const client = Client.deRole(role);
        const keyIdentifiant = {
            uid: client.uid,
            rno: client.rno
        };
        let stock = this.litStockSiExistant();
        if (stock && stock.type !== 'commande') {
            stock = undefined;
        }
        const params = KeyUidRno.créeParams(keyIdentifiant);
        // si le stock existe et n'est pas un contexte résultant d'une erreur 409 précédente
        // il faut vérifier qu'il est à jour en passant la date à l'api
        if (stock && !stock.estContexte) {
            params.dateCatalogue = '' + site.dateCatalogue;
        }

        // Si le site est d'état Catalogue
        //  l'Api retourne l'erreur 409 avec contexte Catalogue: état site = Catalogue, date catalogue = null.
        // Sinon, le site est d'état Ouvert,
        //  si le stock existe et n'est pas un contexte, la date du catalogue du stock est passée en paramètre
        //      si la date du catalogue du stock est antérieure à celle du catalogue de la bdd,
        //          l'Api retourne l'erreur 409 avec contexte Périmé: état site = ouvert, date catalogue = celle du catalogue de la bdd
        //      sinon, le stock est à jour,
        //          l'Api retourne un ApiDocs vide
        // sinon, le stock n'existe pas ou est un contexte,
        //      l'Api retourne un ApiDocs dont le champ Documents contient les données pour client de la dernière commande du client
        const demandeApi = () => this.get<ApiDocs>(ApiController.commande, ApiAction.bon.encours, params);

        // Si l'api a retourné l'erreur 409, met à jour l'état des sites stockés s'il a changé, crée et stocke un ClfDocs contexte
        // et convertit l'erreur 409 en ApiResult204NoContent
        const convertitErreur409: (apiResult: ApiResult) => ApiResult = (apiResult: ApiResult) => {
                if (apiResult.statusCode !== ApiResult409Conflict.code) {
                    // ce n'est pas une erreur du contexte
                    return apiResult;
                }
                // une modification du catalogue est en cours ou a eu lieu depuis le chargement du stock
                const contexte: ContexteCatalogue = (apiResult as ApiResult409Conflict).erreur as ContexteCatalogue;
                const site = this.identification.siteEnCours;
                // le site en mémoire était d'état ouvert quand la requête a été émise
                if (!contexte.ouvert) {
                    // l'état du site a changé depuis le chargement du site
                    site.ouvert = contexte.ouvert;
                    site.dateCatalogue = contexte.dateCatalogue;
                    this.identification.fixeSite(site);
                }
                // crée et stocke un ClfDocs contexte
                const clfDocs = new CLFDocs();
                clfDocs.type = 'commande';
                clfDocs.site = site;
                this.fixeStock(clfDocs);
                return new ApiResult200Ok(null);
            }

            return this.lectureObs<ApiDocs>({
                demandeApi,
                convertitResult: convertitErreur409
            }).pipe(
                concatMap(datas => {
                    if (!datas) {
                        // l'erreur 409 a été convertie en ApiResult200Ok(null)
                        // et le stockage contient un ClfDocs contexte
                        const urlDef = this.utile.url.sitePasOuvert();
                        urlDef.params = [{ nom: 'err', valeur: '409' }];
                        return of(this.routeur.urlTreeUrlDef(urlDef));
                    }
                    if (!datas.apiDocs) {
                        // l'ApiDocs retourné est vide donc le stock existait et était à jour
                        return of(true);
                    }
                    // le stock n'existait pas ou n'était pas à jour 
                    const clfDocs = new CLFDocs();
                    clfDocs.type = 'commande';
                    clfDocs.site = site;
                    clfDocs.client = client;
                    clfDocs.apiDocs = datas.apiDocs;
                    return this.catalogueService.catalogue$().pipe(
                        map(catalogue => {
                            // Pour être sur que le catalogue est chargé
                            this.fixeStock(clfDocs);
                            clfDocs.catalogue = catalogue;
                            return true;
                        })
                    );
                })
            );
    }

    /**
     * Le stock existe et n'est pas un contexte car chargeDocumentOuContexte garde aussi envoi
     * retourne vrai si le document est prêt à l'envoi
     */
    gardeEnvoi(): Observable<boolean | UrlTree> {
        return this.chargeDocumentOuContexte().pipe(
            map((result: boolean | UrlTree) => {
                if (result === true) {
                    const stock = this.litStockSiExistant();
                    if (!stock) {
                        return this.routeur.urlTreeUrlDef(this.utile.url.bon());
                    }
                    if (stock.estContexte) {
                        const urlDef = this.utile.url.sitePasOuvert();
                        urlDef.params = [{ nom: 'err', valeur: '409' }];
                        return this.routeur.urlTreeUrlDef(urlDef);
                    }
                    const apiDoc = stock.apiDocs[0];
                    return !apiDoc.date && apiDoc.lignes.length > 0;
                }
                return result;
            })
        )
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

    /**
     * Contextualise les paramétres d'une requête.
     * L'utilisateur est le client, on ajoute la date du catalogue du stock aux paramétres de la requête.
     * @param params paramétres de la requête
     * @returns params contextualisé
     */
     protected paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string } {
        const stock = this.litStockSiExistant();
        if (stock) {
            const site = this.litSiteEnCours();
            params.dateCatalogue = '' + site.dateCatalogue;
        }
        return params;
    }

}
