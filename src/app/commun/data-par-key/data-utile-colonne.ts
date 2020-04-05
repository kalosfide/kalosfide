import { DataUtile } from './data-utile';
import { DataUtileUrl } from './data-utile-url';
import { DataUtileLien } from './data-utile-lien';

export class DataUtileColonne {
    protected _parent: DataUtile;

    constructor(dataUtile: DataUtile) {
        this._parent = dataUtile;
    }

    get dataUtile(): DataUtile {
        return this._parent;
    }

    get url(): DataUtileUrl {
        return this._parent.url;
    }

    get lien(): DataUtileLien {
        return this._parent.lien;
    }
}
