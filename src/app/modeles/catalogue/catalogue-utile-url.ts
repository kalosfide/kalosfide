import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { CatalogueUtile } from './catalogue-utile';

export class CatalogueUtileUrl extends DataUtileUrl {
    constructor(catalogueUtile: CatalogueUtile) {
        super(catalogueUtile);
    }

    get utile(): CatalogueUtile {
        return this._parent as CatalogueUtile;
    }

}
