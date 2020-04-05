import { CategorieUtile } from './categorie-utile';
import { Categorie } from './categorie';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

export class CategorieUtileLien extends DataUtileLien {
    constructor(utile: CategorieUtile) {
        super(utile);
    }

    get utile(): CategorieUtile {
        return this._parent as CategorieUtile;
    }

    index(): KfLien {
        return this.utile.lienKey.index();
    }
    retourIndex(t: Categorie): KfLien {
        return this.utile.lienKey.retourIndex(t);
    }
    ajoute(): KfLien {
        return this.utile.lienKey.ajoute();
    }
    edite(t: Categorie): KfLien {
        return this.utile.lienKey.edite(t);
    }
    supprime(t: Categorie): KfLien {
        return this.utile.lienKey.supprime(t);
    }

}
