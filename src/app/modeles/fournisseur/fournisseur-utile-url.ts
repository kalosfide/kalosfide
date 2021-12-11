import { FournisseurUtile } from './fournisseur-utile';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { Routeur } from 'src/app/commun/routeur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Fournisseur } from './fournisseur';

export class FournisseurUtileUrl extends DataUtileUrl {
    constructor(utile: FournisseurUtile) {
        super(utile);
    }

    get utile(): FournisseurUtile {
        return this.parent as FournisseurUtile;
    }

    get sitesRouteur(): Routeur {
        return Fabrique.url.appRouteur.admin.sites;
    }

    index(): IUrlDef {
        return this.utile.urlKey.index();
    }
    retourIndex(t: Fournisseur): IUrlDef {
        return this.utile.urlKey.retourIndex(t);
    }

}
