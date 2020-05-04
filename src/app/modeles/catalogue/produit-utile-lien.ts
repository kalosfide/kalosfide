import { ProduitUtile } from './produit-utile';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Produit } from './produit';

export class ProduitUtileLien extends DataUtileLien {
    constructor(utile: ProduitUtile) {
        super(utile);
    }

    get utile(): ProduitUtile {
        return this._parent as ProduitUtile;
    }

    index(): KfLien {
        return this.utile.lienKey.index();
    }
    retourIndex(t: Produit): KfLien {
        return this.utile.lienKey.retourIndex(t);
    }
    ajoute(): KfLien {
        return this.utile.lienKey.ajoute();
    }
    edite(t: Produit): KfLien {
        return this.utile.lienKey.edite(t);
    }

}
