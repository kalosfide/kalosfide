import { DataUtile } from './data-utile';
import { DataUtileUrl } from './data-utile-url';
import { DataUtileLien } from './data-utile-lien';

export class DataUtileOutils {
    protected _dataUtile: DataUtile;

    constructor(dataUtile: DataUtile) {
        this._dataUtile = dataUtile;
    }

    get url(): DataUtileUrl {
        return this._dataUtile.url;
    }

    get lien(): DataUtileLien {
        return this._dataUtile.lien;
    }

    get nomOutil(): {
    } {
        return {
        };
    }

}
