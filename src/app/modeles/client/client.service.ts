import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';

import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Client } from 'src/app/modeles/client/client';
import { KeyUidRnoService } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { ApiController, ApiAction } from '../../commun/api-route';
import { EtatClient } from './etat-client';
import { ApiResult } from '../../commun/api-results/api-result';
import { ApiRequêteService } from '../../services/api-requete.service';
import { ClientUtile } from './client-utile';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { ApiResult200Ok } from 'src/app/commun/api-results/api-result-200-ok';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';

class ApiClients {
    clients: Client[];

    /**
     * date de lecture ou de mise à jour
     */
    date: Date;
}

class Stock {
    siteUid: string;
    siteRno: number;
    identifiantUid: string;
    clients: Client[];

    /**
     * date de lecture ou de mise à jour
     */
    date: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService extends KeyUidRnoService<Client> {

    controllerUrl = ApiController.client;

    private stockage: Stockage<Stock>;

    constructor(
        stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(apiRequeteService);
        this.stockage = stockageService.nouveau<Stock>('Clients', { rafraichit: 'rafraichi', avecDate: true });
        this.créeUtile();
    }

    urlSegmentDeKey = (client: Client): string => {
        return KeyUidRno.texteDeKey(client);
    }

    protected _créeUtile() {
        this.pUtile = new ClientUtile(this);
    }

    get utile(): ClientUtile {
        return this.pUtile as ClientUtile;
    }

    nomPris(nom: string): boolean {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        return !!stock.clients.find(s => s.nom === nom);
    }

    nomPrisParAutre(uid: string, rno: number, nom: string): boolean {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        return !!stock.clients.find(s => s.nom === nom && (s.uid !== uid || s.rno !== rno));
    }

    changeSiteNbClients(deltaNbClients: number) {
        const site = this.navigation.litSiteEnCours();
        site.nbClients += deltaNbClients;
        this.navigation.fixeSiteEnCours(site);
        this.identification.fixeSiteIdentifiant(site);
    }

    /**
     * change l'état d'un client
     * @param client client
     */
    changeEtat(client: Client, etat: string) {
        client.etat = etat;
        // on ne transmet que la key et l'état
        const c = new Client();
        KeyUidRno.copieKey(client, c);
        c.etat = etat;
        return this.put<Client>(ApiController.client, ApiAction.client.etat, c);
    }
    /** actionSiOk de changeEtat */
    quandEtatChange(client: Client) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => KeyUidRno.compareKey(c, client));
        if (index === -1) {
            throw new Error('Clients: édité absent du stock');
        }
        stock.clients[index].etat = client.etat === EtatClient.exclu ? EtatClient.inactif : EtatClient.actif;
        stock.clients[index].dateEtat = new Date(Date.now());
        this.stockage.fixeStock(stock);
    }

    ajoute(objet: Client): Observable<ApiResult> {
        const site = this.navigation.litSiteEnCours();
        const params: { [param: string]: string } = KeyUidRno.créeParams(site);
        params.nom = objet.nom;
        params.adresse = objet.adresse;
        return this.get<Client>(this.controllerUrl, ApiAction.data.ajoute, params).pipe(
            tap((apiResult: ApiResult) => {
                if (apiResult.statusCode === ApiResult200Ok.code) {
                    const client = (apiResult as ApiResult200Ok<Client>).lecture;
                    objet.uid = client.uid;
                    objet.rno = client.rno;
                }
            })
        );
    }

    quandAjoute(ajouté: Client) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        ajouté.dateEtat = new Date(Date.now());
        stock.clients.push(ajouté);
        this.stockage.fixeStock(stock);
        this.changeSiteNbClients(1);
    }

    quandEdite(édité: Client) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => KeyUidRno.compareKey(c, édité));
        if (index === -1) {
            throw new Error('Clients: édité absent du stock');
        }
        Client.copieData(édité, stock.clients[index]);
        this.stockage.fixeStock(stock);
    }

    quandSupprime(supprimé: Client) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => KeyUidRno.compareKey(c, supprimé));
        if (index === -1) {
            throw new Error('Clients: supprimé absent du stock');
        }
        stock.clients.splice(index, 1);
        this.stockage.fixeStock(stock);
    }

    private _clients$(siteUid: string, siteRno: number, identifiantUid: string): Observable<Client[]> {
        // c'est le fournisseur
        const keySite: IKeyUidRno = { uid: siteUid, rno: siteRno };
        const apiResult$ = this.get<ApiClients>(ApiController.client, ApiAction.client.liste, KeyUidRno.créeParams(keySite));
        return this.objet<ApiClients>(apiResult$).pipe(
            take(1),
            map(apiClients => {
                const stock = new Stock();
                stock.siteUid = siteUid;
                stock.siteRno = siteRno;
                stock.identifiantUid = identifiantUid;
                stock.clients = apiClients.clients;
                stock.date = apiClients.date;
                this.stockage.fixeStock(stock);
                return apiClients.clients;
            })
        );
    }

    /**
     * retourne un Observable d'une liste des clients du site en cours
     */
    clients$(): Observable<Client[]> {
        const stock = this.stockage.litStock();
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        if (!stock || stock.siteUid !== site.uid || stock.siteRno !== site.rno || stock.identifiantUid !== identifiant.uid) {
            return this._clients$(site.uid, site.rno, identifiant.uid);
        }
        return of(stock.clients);
    }

    rechargeClients(): Observable<Client[]> {
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        return this._clients$(site.uid, site.rno, identifiant.uid);
    }

    /**
     * vérifie si des clients ont ouvert un compte depuis la date du stock et met à jour le stock
     */
    rafraichitStock(): Observable<Client[]> {
        const stock = this.stockage.litStock();
        const site = this.navigation.litSiteEnCours();

        const params = {
            uid: site.uid,
            rno: '' + site.rno,
            date: (new Date(stock.date)).toDateString()
        };
        const apiResult$ = this.get<ApiClients>(ApiController.client, ApiAction.client.rafraichit, params);
        return this.objet<ApiClients>(apiResult$).pipe(
            map((apiClients: ApiClients) => {
                stock.date = new Date(apiClients.date);
                stock.clients = stock.clients.concat(apiClients.clients);
                this.stockage.fixeStock(stock);
                return stock.clients;
            })
        );
    }

    /**
     * retourne un Observable du Client
     *  - défini par la key si présente (l'utilisateur est le fournisseur du site encours)
     *  - de l'utilisateur si la key est absente (l'utilisateur est un client du site encours)
     * @param key key du client
     */
    client$(key: KeyUidRno, estClient: boolean): Observable<Client> {
        if (estClient) {
            return this.objet<Client>(this.lit({
                uid: key.uid,
                rno: key.rno
            }));
        } else {
            return this.clients$().pipe(
                map(clients => {
                    const client = clients.find(c => c.uid === key.uid && c.rno === key.rno);
                    return client;
                })
            );
        }
    }

}
