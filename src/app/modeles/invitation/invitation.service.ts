import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { ApiResult200Ok } from 'src/app/api/api-results/api-result-200-ok';
import { ApiAction, ApiController } from 'src/app/api/api-route';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { ApiRequêteService } from 'src/app/api/api-requete.service';
import { DataService } from 'src/app/services/data.service';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { ClientService } from '../client/client.service';
import { Invitation } from './invitation';
import { InvitationData } from './invitation-data';
import { InvitationUtile } from './invitation-utile';

class ApiInvitations {
    invitations: Invitation[];

    /**
     * date de lecture ou de mise à jour
     */
    date: Date;
}

class Stock {
    siteUid: string;
    siteRno: number;
    identifiantUid: string;
    invitations: Invitation[];

    /**
     * date de lecture ou de mise à jour
     */
    date: Date;
}

@Injectable({
    providedIn: 'root'
})
export class InvitationService extends DataService {
    controllerUrl = ApiController.utilisateur;

    private stockage: Stockage<Stock>;

    utile: InvitationUtile;

    constructor(
        stockageService: StockageService,
        private clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(apiRequeteService);
        // Le stockage sera réinitialisé à chaque changement de site ou d'identifiant
        this.stockage = stockageService.nouveau<Stock>('Invitations', { rafraichi: true });
        this.utile = new InvitationUtile(this);
    }

    private _invitations$(siteUid: string, siteRno: number, identifiantUid: string): Observable<Invitation[]> {
        // c'est le fournisseur
        const params = KeyUidRno.créeParams({ uid: siteUid, rno: siteRno });
        const demandeApi = () => this.get<ApiInvitations>(ApiController.utilisateur, ApiAction.utilisateur.invitations, params);
        return this.lectureObs<ApiInvitations>({ demandeApi }).pipe(
            take(1),
            switchMap(apiInvitations => {
                const stock = new Stock();
                stock.siteUid = siteUid;
                stock.siteRno = siteRno;
                stock.identifiantUid = identifiantUid;
                stock.invitations = apiInvitations.invitations;
                stock.date = apiInvitations.date;
                return this.clientService.clients$().pipe(
                    map(clients => {
                        stock.invitations.forEach(i => {
                            if (i.uidClient) {
                                i.client = clients.find(c => c.uid === i.uidClient);
                            }
                        });
                        this.stockage.fixeStock(stock);
                        return stock.invitations;
                    })
                );
            })
        );
    }

    invitations$(): Observable<Invitation[]> {
        const stock = this.stockage.litStock();
        if (!stock) {
            const site = this.navigation.litSiteEnCours();
            const identifiant = this.identification.litIdentifiant();
            return this._invitations$(site.uid, site.rno, identifiant.uid);
        }
        return of(stock.invitations);
    }

    litInvitations(): Invitation[] {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Invitations: Pas de stock');
        }
        return stock.invitations;
    }

    invitationExistante(email: string): Observable<Invitation> {
        return this.invitations$().pipe(
            map(invitations => {
                return invitations.find(i => i.email === email);
            })
        );
    }

    /**
     * Si l'invité n'a jamais eu d'invitation à ce site ou si l'InviteClient est semblable à celle déjà enregistrée
     * dans la table Invitation de la BDD (ou si le champ remplace du paramétre est true),
     * lApi envoie l'invitation à l'email de l'invité et ajoute ou modifie l'enregistrement dans la table Invitation;
     * retourne une invitation avec la date de l'enregistrement.
     * Si l'invité a une invitation à ce site qui diffère par son client de l'enregistrement dans la table Invitation,
     * ne fait rien
     * Retourne l'enregistrement de la table Invitation contenant la date de l'invitation enregistrée de l'invité sur le site
     * et éventuellement la clé du client à gérer. La date est undefined ou nulle si l'utilisateur
     * n'a pas déjà été invité.
     * @param àEnvoyer  contient l'email de l'invité et la key du site
     */
    envoie(àEnvoyer: Invitation): Observable<ApiResult> {
        return this.post<Invitation>(ApiController.utilisateur, ApiAction.utilisateur.invitation, àEnvoyer);
    }
    quandEnvoi(invitation: Invitation) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Invitations: Pas de stock');
        }
        stock.invitations.push(invitation);
        if (invitation.client) {
            this.clientService.quandInvitation(invitation.client, true);
        }
    }

    supprime(invitation: Invitation): Observable<ApiResult> {
        return this.delete(ApiController.utilisateur, ApiAction.utilisateur.invitation, Invitation.créeParamsKey(invitation));
    }
    quandSupprime(invitation: Invitation) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Invitations: Pas de stock');
        }
        const index = stock.invitations.findIndex(i => i.email === invitation.email);
        if (index === -1) {
            throw new Error('Invitations: invité absent du stock');
        }
        stock.invitations.splice(index, 1);
        if (invitation.client) {
            this.clientService.quandInvitation(invitation.client, false);
        }
    }
}
