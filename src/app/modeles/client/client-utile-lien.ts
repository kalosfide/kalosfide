import { ClientUtile } from './client-utile';
import { Client } from './client';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class ClientUtileLien extends DataUtileLien {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this._parent as ClientUtile;
    }

    index(): KfLien {
        return this.utile.lienKey.index();
    }
    retourIndex(t: Client): KfLien {
        return this.utile.lienKey.retourIndex(t);
    }
    ajoute(): KfLien {
        return this.utile.lienKey.ajoute();
    }
    edite(t: Client): KfLien {
        return this.utile.lienKey.edite(t);
    }
    aperçu(t: Client): KfLien {
        return this.utile.lienKey.edite(t);
    }

    accepte(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.accepte(client), Fabrique.contenu.accepter));
    }

    exclut(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.exclut(client), Fabrique.contenu.exclure));
    }

    supprime(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.exclut(client), Fabrique.contenu.supprime));
    }
}
