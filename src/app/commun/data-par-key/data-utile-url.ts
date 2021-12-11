import { DataUtile } from './data-utile';
import { PageDef } from '../page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { Routeur } from '../routeur';

export class DataUtileUrl {
    protected parent: DataUtile;

    constructor(dataUtile: DataUtile) {
        this.parent = dataUtile;
    }

    id(texteKey: string) {
        return 'kfvt' + texteKey;
    }

    __urlDef(routeur: Routeur, pageDef?: PageDef, texteKey?: string, retour?: boolean): IUrlDef {
        const urlDef: IUrlDef = {
            pageDef,
            routeur,
        };
        if (texteKey) {
            if (retour) {
                urlDef.fragment = this.id(texteKey);
            } else {
                urlDef.keys = [texteKey];
            }
        }
        return urlDef;
    }

    dePageDef(routeur: Routeur, pageDef: PageDef): IUrlDef {
        return this.__urlDef(routeur, pageDef);
    }

}
