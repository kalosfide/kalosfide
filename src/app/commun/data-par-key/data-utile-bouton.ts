import { DataUtile } from './data-utile';
import { DataUtileUrl } from './data-utile-url';
import { DataUtileLien } from './data-utile-lien';

export class DataUtileBouton {
    protected dataUtile: DataUtile;

    constructor(dataUtile: DataUtile) {
        this.dataUtile = dataUtile;
    }

    get url(): DataUtileUrl {
        return this.dataUtile.url;
    }

    get lien(): DataUtileLien {
        return this.dataUtile.lien;
    }
}
