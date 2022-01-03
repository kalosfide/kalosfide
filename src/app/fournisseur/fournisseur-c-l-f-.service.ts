import { Injectable } from '@angular/core';
import { ApiAction, ApiController } from 'src/app/api/api-route';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { ClientService } from 'src/app/modeles/client/client.service';
import { CLFService } from 'src/app/modeles/c-l-f/c-l-f.service';
import { Observable, of } from 'rxjs';
import { CLFDocs } from '../modeles/c-l-f/c-l-f-docs';
import { TypeCLF } from '../modeles/c-l-f/c-l-f-type';
import { concatMap, map, mergeMap, tap } from 'rxjs/operators';
import { IKeyId } from '../commun/data-par-key/key-id/i-key-id';
import { KeyId } from '../commun/data-par-key/key-id/key-id';
import { Catalogue } from '../modeles/catalogue/catalogue';
import { ApiClientBilanDocs, CLFClientBilanDocs } from '../modeles/c-l-f/c-l-f-bilan-docs';
import { ValeurEtObservable } from '../commun/outils/valeur-et-observable';
import { Client } from '../modeles/client/client';
import { ApiDocs, ApiDocsAvecTarif } from '../modeles/c-l-f/api-docs';

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
        super('CLFFournisseur', catalogueService, stockageService, clientService, apiRequeteService);
        this.utile.utilisateurEstLeClient = false;
        this.utile.url.fixeRoutesDocument();
        this.clientEnCoursIo = ValeurEtObservable.nouveau<Client>(null);
    }

    /**
     * Le ApiDocs retourné par l'Api contient les listes des résumés des bons envoyés et sans synthèse de tous les clients.
     * Le CLFDocs retourné contient les Client de tous les clients.
     * Pas stocké.
     * @param type type du document de synthèse
     */
    clientsAvecRésumésBons(type: TypeCLF): Observable<CLFDocs> {
        const action = ApiAction.docCLF.clients;
        const site = this.litSiteEnCours();
        const params: { [param: string]: string } = {
            uid: site.id,
            rno: '' + site.rno,
        };

        return this.lectureObs<ApiDocs>({
            demandeApi: () => this.get<ApiDocs>(this.controller(type), action, params),
        }).pipe(
            map(apiDocs => {
                const clfDocs = new CLFDocs();
                clfDocs.site = site;
                clfDocs.type = type;
                clfDocs.apiDocs = apiDocs.apiDocs;
                return clfDocs;
            }),
            concatMap(clfDocs => {
                return this.clientService.clients$().pipe(
                    mergeMap(clients => {
                        clfDocs.clients = clients;
                        return of(clfDocs);
                    })
                );
            })
        );;
    }

    /**
     * Pour le fournisseur.
     * Le CLFDocs retourné par l'Api contient les documents envoyés et sans synthèse du client avec les lignes.
     * Le CLFDocs retourné contient le Client du client.
     * Le CLFDocs retourné contient le catalogue à appliquer.
     * Stocké.
     * @param keyClient key du client
     * @param type type du document de synthèse
     */
    clientAvecBons(keyClient: IKeyId, type: TypeCLF): Observable<CLFDocs> {
        const stock = this.litStockSiExistant();
        if (stock // le stock existe
            && stock.type === type // type inchangé
            && KeyId.compareKey(stock.keyClient, keyClient) // client inchangé
        ) {
            return of(stock);
        }
        const site = this.litSiteEnCours();
        let clfDocs$: Observable<CLFDocs>;
        const params: { [param: string]: string } = {
            uid: keyClient.id,
            rno: '' + keyClient.rno,
        };
        clfDocs$ = this.lectureObs<ApiDocsAvecTarif>({
            demandeApi: () => this.get<ApiDocsAvecTarif>(this.controller(type), ApiAction.docCLF.client, params),
        }).pipe(
            map(apiDocs => {
                const clfDocs = new CLFDocs();
                clfDocs.type = type;
                clfDocs.site = site;
                clfDocs.apiDocs = apiDocs.apiDocs;
                clfDocs.tarif = apiDocs.tarif;
                return clfDocs;
            }),
            concatMap(clfDocs => {
                return this.catalogueService.catalogue$().pipe(
                    mergeMap((catalogue?: Catalogue) => {
                        clfDocs.fixeCatalogue(catalogue);
                        return of(clfDocs);
                    })
                );
            }),
            concatMap(clfDocs => {
                return this.clientService.client$(keyClient).pipe(
                    mergeMap(client => {
                        clfDocs.client = client;
                        this.fixeStock(clfDocs);
                        return of(clfDocs);
                    })
                );
            }),
        );

        return clfDocs$;
    }

    /**
     * Contextualise si besoin les paramétres d'une requête.
     * L'utilisateur est le fournisseur, on ne fait rien.
     * @param params paramétres de la requête
     * @returns params inchangé
     */
    protected paramsAvecContexte(params: { [param: string]: string }): { [param: string]: string } {
        return params;
    }

    /**
     * Retourne la liste par client des bilans (nombre et total des montants) des documents par type.
     */
    public clientsAvecBilanDocs(): Observable<CLFClientBilanDocs[]> {
        const site = this.litSiteEnCours();
        const controller = ApiController.document;
        const action = ApiAction.document.bilans;
        return this.lectureObs<ApiClientBilanDocs[]>({
            demandeApi: () => this.get<ApiClientBilanDocs>(controller, action, KeyId.créeParams(site)),
        }).pipe(
            concatMap(apiClientsBilans => this.clientService.clients$().pipe(
                map(clients => apiClientsBilans.map(apiClientBilan => new CLFClientBilanDocs(clients, apiClientBilan)))
            ))
        );
    }

}
