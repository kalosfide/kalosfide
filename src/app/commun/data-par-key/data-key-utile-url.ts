import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IDataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { PageDef } from '../page-def';

export class DataKeyUtileUrl<T extends IDataKey> {
    protected pUtile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this.pUtile = utile;
    }

    index(): IUrlDef {
        return this.pUtile.url.__urlDef(this.pUtile.dataRouteur, this.pUtile.dataPages.index);
    }
    retourIndex(t: T): IUrlDef {
        return this.pUtile.url.__urlDef(this.pUtile.dataRouteur, this.pUtile.dataPages.index, this.pUtile.service.urlSegmentDeKey(t), true);
    }
    ajoute(): IUrlDef {
        return this.pUtile.url.__urlDef(this.pUtile.dataRouteur, this.pUtile.dataPages.ajoute);
    }
    edite(t: T): IUrlDef {
        return this.dePageDef(this.pUtile.dataPages.edite, t);
    }
    supprime(t: T): IUrlDef {
        return this.dePageDef(this.pUtile.dataPages.supprime, t);
    }
    dePageDef(pageDef?: PageDef, t?: T): IUrlDef {
        return this.pUtile.url.__urlDef(this.pUtile.dataRouteur, pageDef, t ? this.pUtile.service.urlSegmentDeKey(t) : null);
    }
}
