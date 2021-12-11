import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Fournisseur } from './fournisseur';
import { FournisseurUtile } from './fournisseur-utile';

export class FournisseurUtileLien extends DataUtileLien {
    constructor(utile: FournisseurUtile) {
        super(utile);
    }

    get utile(): FournisseurUtile {
        return this.parent as FournisseurUtile;
    }

    index(): KfLien {
        return Fabrique.lien.retour(this.utile.url.index());
    }
    retourIndex(t: Fournisseur): KfLien {
        return Fabrique.lien.retour(this.utile.url.retourIndex(t));
    }
}
