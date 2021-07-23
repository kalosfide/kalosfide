import { DataUtile } from './data-utile';
import { DataUtileUrl } from './data-utile-url';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';

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
        return urlDef.pageDef.lien ? urlDef.pageDef.lien : urlDef.pageDef.urlSegment;
    }

    def(nom: string, urlDef: IUrlDef, contenu?: IContenuPhraseDef): ILienDef {
        const def: ILienDef = {
            nom: nom ? nom : urlDef ? urlDef.pageDef.urlSegment : '',
            urlDef,
            contenu: contenu
                ? contenu
                : { texte: this.texte(urlDef) },
        };
        return def;
    }

    déconnection() {
        return Fabrique.lien.enLigne(this.def('deconnection', this.url.déconnection(), { texte: 'déconnecter' }), 'dansAlerte');
    }
}
