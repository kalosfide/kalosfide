import { DataUtile } from './data-utile';
import { DataUtileUrl } from './data-utile-url';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IContenuPhraséDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { ComptePages } from 'src/app/compte/compte-pages';

export class DataUtileLien {
    protected parent: DataUtile;

    constructor(dataUtile: DataUtile) {
        this.parent = dataUtile;
    }

    get dataUtile(): DataUtile {
        return this.parent;
    }

    get url(): DataUtileUrl {
        return this.parent.url;
    }

    texte(urlDef: IUrlDef): string {
        return urlDef.pageDef.lien ? urlDef.pageDef.lien : urlDef.pageDef.path;
    }

    def(nom: string, urlDef: IUrlDef, contenu?: IContenuPhraséDef): ILienDef {
        const def: ILienDef = {
            nom: nom ? nom : urlDef ? urlDef.pageDef.path : '',
            urlDef,
            contenu: contenu
                ? contenu
                : { texte: this.texte(urlDef) },
        };
        return def;
    }

    déconnection() {
        const def = this.def('deconnection', this.url.dePageDef(Fabrique.url.appRouteur.compte, ComptePages.deconnection), { texte: 'déconnecter' });
        return Fabrique.lien.dansAlerte(Fabrique.lien.enLigne(def));
    }
}
