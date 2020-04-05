import { IDataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';

export class DataKeyUtileLien<T extends IDataKey> {
    protected _utile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this._utile = utile;
    }

    def(urlDef: IUrlDef, contenu?: IContenuPhraseDef): ILienDef {
        return this._utile.lien.def('', urlDef, contenu);
    }

    index(): KfLien {
        return Fabrique.lien.lien(this.def(this._utile.urlKey.index()));
    }
    retourIndex(t: T, texte?: string): KfLien {
        return Fabrique.lien.retour(this._utile.urlKey.retourIndex(t), texte);
    }
    ajoute(): KfLien {
        return Fabrique.lien.ajoute(this._utile.urlKey.ajoute());
    }
    edite(t: T): KfLien {
        return Fabrique.lien.lien(this.def(this._utile.urlKey.edite(t), Fabrique.contenu.edite));
    }
    aperçu(t: T): KfLien {
        return Fabrique.lien.lien(this.def(this._utile.urlKey.edite(t), Fabrique.contenu.aperçu));
    }
    supprime(t: T): KfLien {
        return Fabrique.lien.lien(this.def(this._utile.urlKey.supprime(t), Fabrique.contenu.supprime));
    }
}
