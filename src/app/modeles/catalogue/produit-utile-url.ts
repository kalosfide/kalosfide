import { ProduitUtile } from './produit-utile';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { Produit } from './produit';
import { ProduitPages } from 'src/app/fournisseur/catalogue/produits/produit-pages';

export class ProduitUtileUrl extends DataUtileUrl {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._parent as ProduitUtile;
    }

    index(): IUrlDef {
        return this.utile.urlKey.index();
    }
    retourIndex(t: Produit): IUrlDef {
        return this.utile.urlKey.retourIndex(t);
    }
    ajoute(): IUrlDef {
        return this.utile.urlKey.ajoute();
    }
    edite(t: Produit): IUrlDef {
        return this.utile.urlKey.edite(t);
    }
    supprime(t: Produit): IUrlDef {
        return this.utile.urlKey.supprime(t);
    }

}
