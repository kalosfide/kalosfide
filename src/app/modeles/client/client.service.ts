import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';

import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Client } from 'src/app/modeles/client/client';
import { KeyUidRnoService } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { ApiController, ApiAction } from '../../api/api-route';
import { EtatClient } from './etat-client';
import { ApiResult } from '../../api/api-results/api-result';
import { ApiRequêteService } from '../../api/api-requete.service';
import { ClientUtile } from './client-utile';
import { Stockage } from 'src/app/services/stockage/stockage';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { ApiResult201Created } from 'src/app/api/api-results/api-result-201-created';
import { Invitation, InvitationDeApi, InvitationVersApi } from './invitation';

class ApiClients {
    clients: Client[];
    invitations: InvitationDeApi[];

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
    invitations: InvitationDeApi[];

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
        this.stockage = stockageService.nouveau<Stock>('Clients', {
            // Le stockage sera réinitialisé à chaque changement de site ou d'identifiant
            rafraichi: true
        });
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

    private quandEtatChange(client: Client) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => KeyUidRno.compareKey(c, client));
        if (index === -1) {
            throw new Error('Clients: édité absent du stock');
        }
        stock.clients[index].etat = client.etat === EtatClient.fermé ? EtatClient.inactif : EtatClient.actif;
        stock.clients[index].dateEtat = new Date(Date.now());
        this.stockage.fixeStock(stock);
    }

    private remplace(client: Client, nouveau: Client) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.clients.findIndex(c => KeyUidRno.compareKey(c, client));
        if (index === -1) {
            throw new Error('Clients: édité absent du stock');
        }
        stock.clients[index] = nouveau;
        this.stockage.fixeStock(stock);
    }

    active(client: Client) {
        return this.post<Client>(ApiController.client, ApiAction.client.active, null, KeyUidRno.créeParams(client));
    }
    quandActivé(client: Client) {
        client.etat = EtatClient.actif;
        this.quandEtatChange(client);
    }

    inactive(client: Client) {
        return this.post<Client>(ApiController.client, ApiAction.client.inactive, null, KeyUidRno.créeParams(client));
    }
    quandInactivé(client: Client): (créé: Client) => void {
        return (créé: Client) => {
            if (client.email) {
                // le compte est géré par le client
                if (client.etat === EtatClient.actif) {
                    // il était actif, il est devenu inactif
                    client.etat = EtatClient.inactif;
                    this.quandEtatChange(client);
                    return;
                }
                // le compte était d'état nouveau
                // il a été créé par invitation
                // l'api a retourné null si l'invitation ne comprenait aucun compte à gérer
                if (créé) {
                    // créé est un compte identique à celui qui existait quand le client a été invité à le gérer
                    this.remplace(client, créé);
                } else {
                    this.quandSupprime(client);
                }
                return;
            }
            // le compte est géré par le fournisseur
            if (client.avecDocuments) {
                // il est devenu inactif
                client.etat = EtatClient.inactif;
                this.quandEtatChange(client);
            } else {
                // il a été supprimé
                this.quandSupprime(client);
            }
        }
    }

    ajoute(client: Client): Observable<ApiResult> {
        const site = this.navigation.litSiteEnCours();
        const params: { [param: string]: string } = KeyUidRno.créeParams(site);
        params.nom = client.nom;
        params.adresse = client.adresse;
        return this.post(this.controllerUrl, ApiAction.data.ajoute, params).pipe(
            tap((apiResult: ApiResult) => {
                if (apiResult.statusCode === ApiResult201Created.code) {
                    // l'api retourne la clé du client créé
                    const keyClient = (apiResult as ApiResult201Created).entity;
                    client.uid = keyClient.uid;
                    client.rno = keyClient.rno;
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

    private quandInvitation(invitation: Invitation, supprime?: boolean) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const client = stock.clients.find(c => c.uid === invitation.uidClient);
        if (!client) {
            throw new Error('Clients: invité absent du stock');
        }
        if (supprime) {
            client.email = undefined;
            client.invitation = undefined;
        } else {
            client.email = invitation.email;
            client.invitation = invitation;
        }
        this.stockage.fixeStock(stock);
    }

    quandInvitationAjoutée(invitation: Invitation) {
        this.quandInvitation(invitation);
    }

    quandInvitationSupprimée(invitation: Invitation) {
        this.quandInvitation(invitation, true);
    }

    /**
     * Charge le stock depuis l'api sauf s'il est déjà chargé et qu'il n'y a pas d'invitations.
     * S'il y a des invitations, elles ont pu recevoir des réponses et il faut recharger le stock
     * @returns true ou un Observable qui émet true après avoir chargé le stock
     */
    chargeClientsEtInvitations(): Observable<boolean> {
        let stock = this.stockage.litStock();
        if (stock && stock.invitations.length === 0) {
            // Le stock est chargé et aucune invitation n'attend de réponse.
            // Les seuls changements possibles des clients sont la modification du nom ou de l'adresse
            // qui n'ont pas d'importance pour choisir un client dans la liste ou changer son état.
            return of(true);
        }
        const site = this.navigation.litSiteEnCours();
        const identifiant = this.identification.litIdentifiant();
        const demandeApi = () => this.get<ApiClients>(ApiController.client, ApiAction.client.liste, KeyUidRno.créeParams(site));
        return this.lectureObs<ApiClients>({ demandeApi }).pipe(
            take(1),
            map(apiClients => {
                const nouveauStock = new Stock();
                nouveauStock.siteUid = site.uid;
                nouveauStock.siteRno = site.rno;
                nouveauStock.identifiantUid = identifiant.uid;
                nouveauStock.clients = apiClients.clients;
                nouveauStock.invitations = apiClients.invitations;
                if (stock) {
                    // il y avait des invitations
                    // on a répondu à celles qui ne figurent pas dans la nouvelle liste
                    const répondues = stock.invitations.filter(invitation => nouveauStock.invitations.find(i => i.email === invitation.email) === undefined);
                    // on donne l'état nouveau aux clients créés par ces réponses
                    répondues.forEach(invitation => {
                        const client = nouveauStock.clients.find(c => c.email === invitation.email);
                        client.etat = EtatClient.nouveau;
                    })
                }
                nouveauStock.date = apiClients.date;
                this.stockage.fixeStock(nouveauStock);
                return true;
            })
        );

    }

    /**
     * Lit les clients dans le stock
     * @returns liste des clients avec leur propriété invitation
     */
    litClients(): Client[] {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        stock.invitations.forEach(invitation => {
            if (invitation.uidClient) {
                const client = stock.clients.find(c => c.uid === invitation.uidClient);
                client.invitation = invitation;
            }
        });
        return stock.clients;
    }

    litClient(key: KeyUidRno): Client {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const client = stock.clients.find(c => c.uid === key.uid && c.rno === key.rno);
        if (client) {
            client.invitation = stock.invitations.find(invitation => invitation.uidClient === client.uid && invitation.rnoClient === client.rno);
        }
        return client;
    }

    private créeInvitation(invitationData: InvitationDeApi, clients: Client[]): Invitation {
        const invitation = Invitation.nouveau(invitationData);
        if (invitation.uidClient) {
            const client = clients.find(c => c.uid === invitation.uidClient && c.rno === invitation.rnoClient);
            invitation.client = client;
        }
        return invitation;
    }

    litInvitations(): Invitation[] {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        return stock.invitations.map(invitationData => this.créeInvitation(invitationData, stock.clients));
    }

    litInvitation(email: string): Invitation {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const invitation = stock.invitations.find(i => i.email === email);
        if (invitation) {
            return this.créeInvitation(invitation, stock.clients);
        }
    }

    /**
     * retourne un Observable d'une liste des clients du site en cours
     */
    clients$(): Observable<Client[]> {
        return this.chargeClientsEtInvitations().pipe(
            map(() => {
                return this.litClients();
            })
        );
    }

    /**
     * retourne un Observable du Client
     * @param key key du client
     */
    client$(key: KeyUidRno): Observable<Client> {
        return this.chargeClientsEtInvitations().pipe(
            map(() => {
                return this.litClient(key);
            })
        );
    }

    /**
     * Si l'invité n'a jamais eu d'invitation à ce site ou si l'InviteClient est semblable à celle déjà enregistrée
     * dans la table Invitation de la BDD (ou si le champ remplace du paramétre est true),
     * l'Api envoie l'invitation à l'email de l'invité et ajoute ou modifie l'enregistrement dans la table Invitation;
     * retourne une invitation avec la date de l'enregistrement.
     * Si l'invité a une invitation à ce site qui diffère par son client de l'enregistrement dans la table Invitation,
     * ne fait rien
     * Retourne l'enregistrement de la table Invitation contenant la date de l'invitation enregistrée de l'invité sur le site
     * et éventuellement la clé du client à gérer. La date est undefined ou nulle si l'utilisateur
     * n'a pas déjà été invité.
     * @param àEnvoyer  contient l'email de l'invité et la key du site
     */
    envoie(àEnvoyer: Invitation): Observable<ApiResult> {
        const site = this.navigation.litSiteEnCours();
        return this.post<InvitationVersApi>(ApiController.utilisateur, ApiAction.utilisateur.invitation, InvitationVersApi.nouveau(àEnvoyer, site));
    }
    quandEnvoi(invitation: Invitation) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.invitations.findIndex(i => i.email === invitation.email);
        if (index !== -1) {
            stock.invitations[index] = invitation;
        } else {
            stock.invitations.push(invitation);
        }
        if (invitation.uidClient) {
            const client = stock.clients.find(c => c.uid === invitation.uidClient);
            if (!client) {
                throw new Error('Clients: invité absent du stock');
            }
            client.invitation = invitation;
        }
        this.stockage.fixeStock(stock);
    }

    supprimeInvitation(invitation: Invitation): Observable<ApiResult> {
        return this.delete(ApiController.utilisateur, ApiAction.utilisateur.invitation, Invitation.créeParamsKey(invitation));
    }
    quandSupprimeInvitation(invitation: Invitation) {
        const stock = this.stockage.litStock();
        if (!stock) {
            throw new Error('Clients: Pas de stock');
        }
        const index = stock.invitations.findIndex(i => i.email === invitation.email);
        if (index === -1) {
            throw new Error('Clients: invitation absent du stock');
        }
        stock.invitations.splice(index, 1);
        if (invitation.uidClient) {
            this.quandInvitationSupprimée(invitation);
        }
    }
}
