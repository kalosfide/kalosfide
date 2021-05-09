import { ClientUtile } from './client-utile';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { Client } from './client';
import { FournisseurClientRoutes, FournisseurClientPages } from 'src/app/fournisseur/clients/client-pages';

export class ClientUtileUrl extends DataUtileUrl {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this.parent as ClientUtile;
    }

    accueil(): IUrlDef {
        return this.utile.url.dePageDef(FournisseurClientRoutes, FournisseurClientPages.accueil);
    }
    invitations(): IUrlDef {
        return this.utile.url.dePageDef(FournisseurClientRoutes, FournisseurClientPages.invitations);
    }

    index(): IUrlDef {
        return this.utile.urlKey.index();
    }
    retourIndex(t: Client): IUrlDef {
        return this.utile.urlKey.retourIndex(t);
    }
    ajoute(): IUrlDef {
        return this.utile.urlKey.ajoute();
    }
    edite(t: Client): IUrlDef {
        return this.utile.urlKey.edite(t);
    }
    supprime(t: Client): IUrlDef {
        return this.utile.urlKey.supprime(t);
    }

    invite(client: Client): IUrlDef {
        const def = this.utile.urlKey.dePageDef(FournisseurClientPages.invite, client);
        def.params = [
            {
                nom: 'retour',
                valeur: FournisseurClientPages.index.urlSegment
            }
        ];
        return def;
    }

    accepte(client: Client): IUrlDef {
        return this.utile.urlKey.dePageDef(FournisseurClientPages.accepte, client);
    }

    exclut(client: Client): IUrlDef {
        return this.utile.urlKey.dePageDef(FournisseurClientPages.exclut, client);
    }
}
