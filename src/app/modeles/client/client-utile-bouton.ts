import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { ClientUtile } from './client-utile';
import { ClientUtileUrl } from './client-utile-url';
import { ClientUtileLien } from './client-utile-lien';

export class ClientUtileBouton extends DataUtileBouton {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this._dataUtile as ClientUtile;
    }

    get url(): ClientUtileUrl {
        return this.utile.url;
    }

    get lien(): ClientUtileLien {
        return this.utile.lien;
    }

}
