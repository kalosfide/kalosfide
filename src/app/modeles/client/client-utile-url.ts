import { ClientUtile } from './client-utile';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { Client } from './client';
import { ClientPages } from 'src/app/fournisseur/clients/client-pages';

export class ClientUtileUrl extends DataUtileUrl {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this._parent as ClientUtile;
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

    accepte(client: Client): IUrlDef {
        return this.utile.urlKey.dePageDef(ClientPages.accepte, client);
    }

    exclut(client: Client): IUrlDef {
        return this.utile.urlKey.dePageDef(ClientPages.exclut, client);
    }
}
