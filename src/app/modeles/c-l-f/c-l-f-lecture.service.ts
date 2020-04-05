import { KeyUidRnoNoService } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no.service';
import { Observable, of, Subject } from 'rxjs';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { Site } from '../site/site';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { ApiDocument } from './api-document';
import { CatalogueService } from '../catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { Stockage } from 'src/app/services/stockage/stockage';
import { CLFDocs } from './c-l-f-docs';
import { map, tap, mergeMap, concatMap } from 'rxjs/operators';
import { ApiDocumentsData } from './api-documents-client-data';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Catalogue } from '../catalogue/catalogue';
import { ClientService } from '../client/client.service';
import { TypeCLF } from './c-l-f-type';
import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { CLFBilan } from './c-l-f-bilan';
import { DATE_EST_NULLE } from '../date-nulle';
import { IdEtatSite } from '../etat-site';
import { CLFFiltre } from './c-l-f-filtre';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { ApiResult409Conflict } from 'src/app/commun/api-results/api-result-409-conflict';

export abstract class CLFLectureService extends KeyUidRnoNoService<ApiDocument> {

    protected pStockage: Stockage<CLFDocs>;

    private pClsBilanIO?: KfInitialObservable<CLFBilan>;

    protected siDoitRecharger: (contenuARecharger: CLFDocs) => void;
    get traiteErreur(): (apiResult: ApiResult) => boolean {
        if (this.siDoitRecharger) {
            return ((apiResult: ApiResult) => {
                if (apiResult.statusCode === ApiResult409Conflict.code) {
                    this.siDoitRecharger(((apiResult as ApiResult409Conflict).erreur as CLFDocs));
                    return true;
                }
                return false;
            }).bind(this);
        }
    }

    private pFiltre: CLFFiltre;

    private clientAvecBonsSubject: Subject<CLFDocs>;
    clientAvecBonsObs: Observable<CLFDocs>;

    constructor(
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(apiRequeteService);
        this.pStockage = stockageService.nouveau<CLFDocs>('Documents', {
            rafraichit: 'rafraichi',
            avecDate: true
        });
        this.pClsBilanIO = KfInitialObservable.nouveau(CLFBilan.bilanVide());
    }

    controller(type: TypeCLF): string {
        return type === 'commande'
            ? ApiController.commande
            : type === 'livraison'
                ? ApiController.livraison
                : ApiController.facture;
    }

    typeASynthétiser(type: TypeCLF): TypeCLF {
        return type === 'livraison'
            ? 'commande'
            : type === 'facture'
                ? 'livraison'
                : undefined;
    }

    changeChoisi(noDoc: number, choisi: boolean) {
        const clfDocs = this.litStock();
        clfDocs.changeChoisi(noDoc, choisi);
        this.pStockage.fixeStock(clfDocs);
        this.pClsBilanIO.changeValeur(clfDocs.clfBilan);
    }

    get clsBilanIO(): KfInitialObservable<CLFBilan> {
        return this.pClsBilanIO;
    }

    litStock(): CLFDocs {
        const stocké = this.pStockage.litStock();
        if (stocké) {
            const stock = new CLFDocs();
            stock.copie(stocké);
            return stock;
        }
    }

    fixeStock(stock: CLFDocs) {
        if (stock.type !== 'commande' && !stock.estContexte) {
            stock.créeBilan();
        }
        this.pStockage.fixeStock(stock);
        if (stock.type !== 'commande') {
            this.pClsBilanIO.changeValeur(stock.clfBilan);
        }
    }

    // Lectures de CLFDocs

    /**
     * Le CLFDocs lu dans l'Api.
     * Le CLFDocs retourné contient le Site et la key du role de l'utilisateur.
     * Pas stocké.
     */
    protected litClfDocs(controller: string, action: string, params: { [param: string]: string }): Observable<CLFDocs> {
        const apiResult$ = this.get<ApiDocumentsData>(controller, action, params);
        const clfDocs$: Observable<CLFDocs> = this.objet<ApiDocumentsData>(apiResult$, this.traiteErreur).pipe(
            map(datas => {
                const clfDocs = new CLFDocs();
                clfDocs.charge(datas);
                return clfDocs;
            })
        );
        return clfDocs$;
    }

    /**
     * Le CLFDocs lu dans l'Api.
     * Le CLFDocs retourné contient le Site et la key du role de l'utilisateur.
     * Pas stocké.
     */
    private _clfDocs$(controller: string, action: string, params: { [param: string]: string }): Observable<CLFDocs> {
        const apiResult$ = this.get<ApiDocumentsData>(controller, action, params);
        const clfDocs$: Observable<CLFDocs> = this.objet<ApiDocumentsData>(apiResult$, this.traiteErreur).pipe(
            map(datas => {
                const clfDocs = new CLFDocs();
                clfDocs.charge(datas);
                clfDocs.site = this.navigation.litSiteEnCours();
                const identifiant = this.identification.litIdentifiant();
                clfDocs.keyIdentifiant = { uid: identifiant.uid, rno: identifiant.roleNo(clfDocs.site) };
                return clfDocs;
            })
        );
        return clfDocs$;
    }

    protected _fixeCatalogue$(clfDocs$: Observable<CLFDocs>): Observable<CLFDocs> {
        clfDocs$ = clfDocs$.pipe(
            concatMap(clfDocs => {
                const tarifs = clfDocs.documents.filter(d => !!d.tarif).map(d => d.tarif);
                return this.catalogueService.cataloguePlusRécentQue$(clfDocs.site, tarifs, clfDocs.catalogue).pipe(
                    mergeMap((catalogue: Catalogue) => {
                        if (catalogue.produits) {
                            clfDocs.catalogue = catalogue;
                            if (DATE_EST_NULLE(catalogue.date)) {
                                // le site est d'état Catalogue
                                // lancer une erreur?
                            }
                        }
                        return of(clfDocs);
                    })
                );
            })
        );
        return clfDocs$;
    }

    protected fixeSiteEtIdentifiant(clfDocs: CLFDocs, site?: Site, keyIdentifiant?: KeyUidRno) {
        if (!site) {
            site = this.navigation.litSiteEnCours();
        }
        clfDocs.site = site;
        if (!keyIdentifiant) {
            const identifiant = this.identification.litIdentifiant();
            keyIdentifiant = { uid: identifiant.uid, rno: identifiant.roleNo(site) };
        }
        clfDocs.keyIdentifiant = keyIdentifiant;
    }

    protected _fixeClient$(clfDocs$: Observable<CLFDocs>, keyClient: IKeyUidRno, estClient: boolean): Observable<CLFDocs> {
        clfDocs$ = clfDocs$.pipe(
            concatMap(clfDocs => {
                return this.clientService.client$(keyClient, estClient).pipe(
                    mergeMap(client => {
                        clfDocs.client = client;
                        return of(clfDocs);
                    })
                );
            })
        );
        return clfDocs$;
    }

    private _fixeClients$(clfDocs$: Observable<CLFDocs>): Observable<CLFDocs> {
        clfDocs$ = clfDocs$.pipe(
            concatMap(clfDocs => {
                return this.clientService.clients$().pipe(
                    mergeMap(clients => {
                        clfDocs.clients = clients;
                        return of(clfDocs);
                    })
                );
            })
        );
        return clfDocs$;
    }

    get filtre(): CLFFiltre {
        return this.pFiltre;
    }

    détruitFiltre() {
        this.pFiltre = undefined;
    }

    /**
     * Pour le client.
     * Le CLFDocs lu dans l'Api contient les listes des résumés des documents du client avec leur type.
     * Le CLFDocs retourné contient le Client du client.
     * Pas stocké.
     */
    documentsDuClient(): Observable<CLFDocs> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const keyClient = { uid: identifiant.uid, rno: identifiant.roleNo(site) };
        const controller = ApiController.document;
        const action = ApiAction.document.client;
        if (!this.pFiltre || this.pFiltre.uid !== keyClient.uid || this.pFiltre.rno !== keyClient.rno) {
            this.pFiltre = new CLFFiltre(keyClient);
        }
        let clfDocs$ = this._clfDocs$(controller, action, this.pFiltre.créeParams());
        clfDocs$ = this._fixeClient$(clfDocs$, keyClient, true);
        return clfDocs$;
    }

    /**
     * Pour le fournisseur.
     * Le CLFDocs lu dans l'Api contient les listes des résumés des documents de tous les clients avec leur type.
     * Le CLFDocs retourné contient les Client de tous les clients.
     * Pas stocké.
     */
    documentsDuSite(): Observable<CLFDocs> {
        const site = this.navigation.litSiteEnCours();
        if (!this.pFiltre || this.pFiltre.uid !== site.uid || this.pFiltre.rno !== site.rno) {
            this.pFiltre = new CLFFiltre(site);
        }
        const controller = ApiController.document;
        const action = ApiAction.document.clients;
        let clfDocs$ = this._clfDocs$(controller, action, this.pFiltre.créeParams());
        clfDocs$ = this._fixeClients$(clfDocs$);
        return clfDocs$;
    }

    /**
     * Pour le client et le fournisseur.
     * Le CLFDocs lu dans l'Api contient le document avec les lignes et le Client du client.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * @param keyDocument key du document
     * @param type type du document
     * Pas stocké.
     */
    document(keyDocument: IKeyUidRnoNo, type: TypeCLF): Observable<CLFDocs> {
        const controller = ApiController.document;
        const action = type === 'commande'
            ? ApiAction.document.commande
            : type === 'livraison'
                ? ApiAction.document.livraison
                : ApiAction.document.facture;
        const params: { [param: string]: string } = {
            uid: keyDocument.uid,
            rno: '' + keyDocument.rno,
            no: '' + keyDocument.no,
        };
        let clfDocs$ = this._clfDocs$(controller, action, params);
        clfDocs$ = this._fixeCatalogue$(clfDocs$);
        return clfDocs$.pipe(
            tap(clfDocs => {
                clfDocs.catalogue = Catalogue.nouveau(clfDocs.documents[0].tarif);
                clfDocs.type = type;
            })
        );
    }

    /**
     * Pour le fournisseur.
     * Le CLFDocs lu dans l'Api contient les listes des résumés des bons envoyés et sans synthèse de tous les clients.
     * Le CLFDocs retourné contient les Client de tous les clients.
     * Pas stocké.
     * @param type type du document de synthèse
     */
    clientsAvecRésumésBons(type: TypeCLF): Observable<CLFDocs> {
        const action = ApiAction.docCLF.clients;
        const site = this.navigation.litSiteEnCours();
        const params: { [param: string]: string } = {
            uid: site.uid,
            rno: '' + site.rno,
        };
        let clfDocs$ = this._clfDocs$(this.controller(type), action, params);
        clfDocs$ = this._fixeClients$(clfDocs$);
        return clfDocs$.pipe(tap(clfDocs => clfDocs.type = type));
    }

    private créeClientAvecBonsSubject() {
        this.clientAvecBonsSubject = new Subject<CLFDocs>();
        this.clientAvecBonsSubject.asObservable().subscribe(clfDocs => console.log('créeClientAvecBonsSubject', clfDocs));
    }

    private détruitClientAvecBonsSubject(clfDocs: CLFDocs) {
        this.clientAvecBonsSubject.next(clfDocs);
        this.clientAvecBonsSubject = undefined;
    }

    /**
     * Pour le fournisseur.
     * Le CLFDocs lu dans l'Api contient les documents envoyés et sans synthèse du client avec les lignes.
     * Le CLFDocs retourné contient le Client du client.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * Stocké.
     * @param keyClient key du client
     */
    clientAvecBons(keyClient: IKeyUidRno, type: TypeCLF): Observable<CLFDocs> {
        if (!this.clientAvecBonsSubject) {
            this.clientAvecBonsSubject = new Subject<CLFDocs>();
            this.clientAvecBonsObs = this.clientAvecBonsSubject.asObservable();
        }
        const stock = this.litStock();
        const site = this.navigation.litSiteEnCours();
        const keySite = {
            uid: site.uid,
            rno: site.rno
        };
        let clfDocs$: Observable<CLFDocs>;
        if (!stock
            || stock.type !== type
            || !KeyUidRno.compareKey(stock.keyClient, keyClient) // client changé
            || !KeyUidRno.compareKey(stock.site, keySite) // site changé
        ) {
            const action = ApiAction.docCLF.client;
            const params: { [param: string]: string } = {
                uid: keyClient.uid,
                rno: '' + keyClient.rno,
            };
            clfDocs$ = this._clfDocs$(this.controller(type), action, params);
            clfDocs$ = this._fixeClient$(clfDocs$, keyClient, false).pipe(
                tap(clfDocs => {
                    clfDocs.type = type;
                    this.fixeSiteEtIdentifiant(clfDocs, site);
                }));
        } else {
            clfDocs$ = of(stock);
        }

        clfDocs$ = clfDocs$.pipe(
            concatMap(clfDocs => {
                const tarifs = clfDocs.documents.filter(d => !!d.tarif).map(d => d.tarif);
                return this.catalogueService.cataloguePlusRécentQue$(clfDocs.site, tarifs, clfDocs.catalogue).pipe(
                    mergeMap((catalogue?: Catalogue) => {
                        if (!catalogue.produits) {
                            // clfDocs.catalogue est à jour. Il n'y a rien à faire
                        } else {
                            clfDocs.catalogue = catalogue;
                            // clfDocs.catalogue n'existe pas ou est obsolète
                            if (DATE_EST_NULLE(catalogue.date)) {
                                // le site est d'état Catalogue
                                if (site.etat !== IdEtatSite.catalogue) {
                                    this.catalogueService.commenceModification(site);
                                }
                            } else {
                                // le site n'est pas d'état Catalogue
                                if (site.etat === IdEtatSite.catalogue) {
                                    this.catalogueService.termineModification(site);
                                }
                            }
                        }
                        this.fixeStock(clfDocs);
                        this.détruitClientAvecBonsSubject(clfDocs);
                        return of(clfDocs);
                    })
                );
            }),
        );

        return clfDocs$;
    }

    bons(): Observable<CLFDocs> {
        if (this.clientAvecBonsSubject) {
            //            return this.clientAvecBonsSubject.asObservable();
        }
        return of(this.litStock());
    }

    /**
     * Fixe le stock.
     * @param clfDocs le documents ne contient que les bons sélectionnés pour la synthèse
     */
    fixeAPréparer(clfDocs: CLFDocs) { }

}
