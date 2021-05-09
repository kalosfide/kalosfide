import { IDataKey } from './data-key';
import { DataKeyUtile } from './data-key-utile';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';

export class DataKeyUtileLien<T extends IDataKey> {
    protected pUtile: DataKeyUtile<T>;

    constructor(utile: DataKeyUtile<T>) {
        this.pUtile = utile;
    }

    def(urlDef: IUrlDef, contenu?: IContenuPhraseDef): ILienDef {
        return this.pUtile.lien.def('', urlDef, contenu);
    }

    index(): KfLien {
        return Fabrique.lien.lien(this.def(this.pUtile.urlKey.index()));
    }
    retourIndex(t: T, texte?: string): KfLien {
        return Fabrique.lien.retour(this.pUtile.urlKey.retourIndex(t), texte);
    }
    ajoute(): KfLien {
        return Fabrique.lien.ajoute(this.pUtile.urlKey.ajoute());
    }
    edite(t: T): KfLien {
        return Fabrique.lien.lien(this.def(this.pUtile.urlKey.edite(t), Fabrique.contenu.edite));
    }
    aperçu(t: T): KfLien {
        return Fabrique.lien.lien(this.def(this.pUtile.urlKey.edite(t), Fabrique.contenu.aperçu));
    }
    supprime(t: T): KfLien {
        return Fabrique.lien.lien(this.def(this.pUtile.urlKey.supprime(t), Fabrique.contenu.supprime));
    }
}
