import { Injectable } from '@angular/core';
import { ApiAction, ApiController } from 'src/app/api/api-route';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { ClientService } from 'src/app/modeles/client/client.service';
import { CLFService } from 'src/app/modeles/c-l-f/c-l-f.service';
import { Observable, of } from 'rxjs';
import { CLFDocs } from '../modeles/c-l-f/c-l-f-docs';
import { CLFFiltre } from '../modeles/c-l-f/c-l-f-filtre';
import { TypeCLF } from '../modeles/c-l-f/c-l-f-type';
import { concatMap, mergeMap, tap } from 'rxjs/operators';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { Catalogue } from '../modeles/catalogue/catalogue';

@Injectable({
    providedIn: 'root'
})
export class FournisseurCLFService extends CLFService {

    controllerUrl = ApiController.livraison;

    constructor(
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(catalogueService, stockageService, clientService, apiRequeteService);
        this.utile.utilisateurEstLeClient = false;
    }

    /**
     * Fixe le champ clients du CLFDocs émis par l'Observable
     */
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

    /**
     * Le CLFDocs lu dans l'Api contient les listes des résumés des documents de tous les clients avec leur type.
     * Le CLFDocs retourné contient les Client de tous les clients.
     * Pas stocké.
     */
    documents(): Observable<CLFDocs> {
        const site = this.navigation.litSiteEnCours();
        if (!this.pFiltre || this.pFiltre.uid !== site.uid || this.pFiltre.rno !== site.rno) {
            this.pFiltre = new CLFFiltre(site);
        }
        const controller = ApiController.document;
        const action = ApiAction.document.clients;
        let clfDocs$ = this._clfDocs$(site, controller, action, this.pFiltre.créeParams());
        clfDocs$ = this._fixeClients$(clfDocs$);
        return clfDocs$;
    }


    /**
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
        let clfDocs$ = this._clfDocs$(site, this.controller(type), action, params);
        clfDocs$ = this._fixeClients$(clfDocs$);
        return clfDocs$.pipe(tap(clfDocs => clfDocs.type = type));
    }

    /**
     * Pour le fournisseur.
     * Le CLFDocs lu dans l'Api contient les documents envoyés et sans synthèse du client avec les lignes.
     * Le CLFDocs retourné contient le Client du client.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * Stocké.
     * @param keyClient key du client
     * @param type type du document de synthèse
     */
    clientAvecBons(keyClient: IKeyUidRno, type: TypeCLF): Observable<CLFDocs> {
        const stock = this.litStockSiExistant();
        const site = this.navigation.litSiteEnCours();
        let clfDocs$: Observable<CLFDocs>;
        if (!stock
            || stock.type !== type
            || !KeyUidRno.compareKey(stock.keyClient, keyClient) // client changé
        ) {
            const action = ApiAction.docCLF.client;
            const params: { [param: string]: string } = {
                uid: keyClient.uid,
                rno: '' + keyClient.rno,
            };
            clfDocs$ = this._clfDocs$(site, this.controller(type), action, params).pipe(
                concatMap(clfDocs => {
                    clfDocs.type = type;
                    return this.clientService.client$(keyClient).pipe(
                        mergeMap(client => {
                            clfDocs.client = client;
                            return of(clfDocs);
                        })
                    );
                })
            );
        } else {
            clfDocs$ = of(stock);
        }

        clfDocs$ = clfDocs$.pipe(
            concatMap(clfDocs => {
                const tarifs = clfDocs.documents.filter(d => !!d.tarif).map(d => d.tarif);
                return this.catalogueService.disponiblesAvecPrixDatés(clfDocs.site, tarifs).pipe(
                    mergeMap((catalogue?: Catalogue) => {
                        clfDocs.catalogue = catalogue;
                        this.fixeStock(clfDocs);
                        return of(clfDocs);
                    })
                );
            }),
        );

        return clfDocs$;
    }
}
