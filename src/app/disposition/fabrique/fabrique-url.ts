import { KfStringDef, ValeurStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { PageDef } from 'src/app/commun/page-def';
import { AppRouteur } from 'src/app/app-routeur';
import { Routeur } from 'src/app/commun/routeur';

export interface IUrlDef {
    /**
     * PageDef de la cible 
     */
    pageDef?: PageDef;

    /**
     * Si présent, fabrique d'url du parent de la cible si pageDef est présent, de la cible sinon.
     * Si absent, la fabrique d'url de AppSite est utilisée.
     */
    routeur: Routeur;

    /**
     * Segments de l'url dépendant de la key d'un objet
     */
    keys?: string[];

    /**
     * # fragment de la balise Html a
     */
    fragment?: string;

    /**
     * vrai si le lien pointe vers une ancre de la page
     */
    local?: boolean;
    params?: { nom: string, valeur: string }[];
}

export class FabriqueUrl {
    appRouteur: AppRouteur;

    constructor() {
        this.appRouteur = new AppRouteur();
    }

    url(def: IUrlDef): KfStringDef {
        let segments: string[] = [];
        if (def.pageDef) {
            segments = [def.pageDef.path];
        }
        if (def.keys) {
            segments = segments.concat(def.keys);
        }
        return def.routeur.url(...segments);
    }

    params(def: IUrlDef): any {
        if (def.params) {
            const params: { [key: string]: string } = {};
            def.params.forEach(p => params[p.nom] = p.valeur);
            return params;
        }
    }
   /**
    * retourne true si l'url à tester est celle de la définition
    * @param url url à tester
    * @param def définition d'url
    */
    urlEstEgale(url: string, def: IUrlDef): boolean {
        const defUrl = ValeurStringDef(this.url(def));
        return url === defUrl;
    }
    /**
     * si l'url à tester est celle de la définition suivie de segments d'url, retourne ces segments
     * @param url url à tester
     * @param def définition d'url
     */
    segmentsDeKey(url: string, def: IUrlDef): string[] {
        const defUrl = ValeurStringDef(this.url(def));
        if (url.length >= defUrl.length && url.substr(0, defUrl.length) === defUrl) {
            const urlKey = url.substr(defUrl.length + 1);
            return urlKey.split('/');
        }
    }
    /**
     * retourne true si l'url à tester est celle de la définition suivie de segments d'url
     * @param url url à tester
     * @param def définition d'url
     */
    urlCommenceComme(url: string, def: IUrlDef): boolean {
        const defUrl = ValeurStringDef(this.url(def));
        return url.length >= defUrl.length && url.substr(0, defUrl.length) === defUrl;
    }

}
