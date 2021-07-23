import { ClientUtile } from './client-utile';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { Client } from './client';
import { FournisseurClientRoutes, FournisseurClientPages } from 'src/app/fournisseur/clients/client-pages';
import { Invitation } from './invitation';
import { iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { PageDef } from 'src/app/commun/page-def';

export class ClientUtileUrl extends DataUtileUrl {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this.parent as ClientUtile;
    }

    accueil(): IUrlDef {
        return this.__urlDef(FournisseurClientRoutes, FournisseurClientPages.accueil);
    }

    index(): IUrlDef {
        return this.utile.urlKey.index();
    }
    retourIndex(t: Client): IUrlDef {
        return this.utile.urlKey.retourIndex(t);
    }

    private urlCompte(pageDef: PageDef, client?: Client): IUrlDef {
        let texteKey: string;
        if (client) {
            texteKey = this.utile.service.urlSegmentDeKey(client);
        }
        return this.__urlDef(iSiteRoutePlusSegments(FournisseurClientRoutes, [FournisseurClientPages.index.urlSegment]), pageDef, texteKey);
    }
    ajoute(): IUrlDef {
        return this.urlCompte(FournisseurClientPages.ajoute)
    }
    edite(t: Client): IUrlDef {
        return this.urlCompte(FournisseurClientPages.edite, t);
    }

    accepte(client: Client): IUrlDef {
        return this.urlCompte(FournisseurClientPages.accepte, client);
    }

    exclut(client: Client): IUrlDef {
        return this.urlCompte(FournisseurClientPages.exclut, client);
    }
    inviteClient(client?: Client): IUrlDef {
        return this.urlCompte(FournisseurClientPages.invite, client);
    }

    invitations(): IUrlDef {
        return this.dePageDef(FournisseurClientRoutes, FournisseurClientPages.invitations);
    }
    retourInvitations(invitation: Invitation): IUrlDef {
        return this.__urlDef(FournisseurClientRoutes, FournisseurClientPages.invitations, invitation.email, true);
    }
    private urlInvitation(pageDef: PageDef, texteKey?: string): IUrlDef {
        return this.__urlDef(iSiteRoutePlusSegments(FournisseurClientRoutes, [FournisseurClientPages.invitations.urlSegment]), pageDef, texteKey);
    }
    invite(): IUrlDef {
        return this.urlInvitation(FournisseurClientPages.invite);
    }
    réinvite(invitation: Invitation): IUrlDef {
        return this.urlInvitation(FournisseurClientPages.réinvite, invitation.email);
    }
}
