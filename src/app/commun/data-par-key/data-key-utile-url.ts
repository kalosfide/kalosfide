import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IDataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { PageDef } from '../page-def';

export class DataKeyUtileUrl<T extends IDataKey> {
    protected _utile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this._utile = utile;
    }

    index(): IUrlDef {
        return this._utile.url.__urlDef(this._utile.dataRoutes, this._utile.dataPages.index);
    }
    retourIndex(t: T): IUrlDef {
        return this._utile.url.__urlDef(this._utile.dataRoutes, this._utile.dataPages.index, this._utile.urlSegmentDeKey(t), true);
    }
    ajoute(): IUrlDef {
        return this._utile.url.__urlDef(this._utile.dataRoutes, this._utile.dataPages.ajoute);
    }
    edite(t: T): IUrlDef {
        return this.dePageDef(this._utile.dataPages.edite, t);
    }
    supprime(t: T): IUrlDef {
        return this.dePageDef(this._utile.dataPages.supprime, t);
    }
    dePageDef(pageDef: PageDef, t: T): IUrlDef {
        return this._utile.url.__urlDef(this._utile.dataRoutes, pageDef, this._utile.urlSegmentDeKey(t));
    }
}
