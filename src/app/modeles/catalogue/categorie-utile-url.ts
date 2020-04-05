import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { CategorieUtile } from './categorie-utile';

export class CategorieUtileUrl extends DataUtileUrl {
    constructor(utile: CategorieUtile) {
        super(utile);
    }

    get utile(): CategorieUtile {
        return this._parent as CategorieUtile;
    }

}
