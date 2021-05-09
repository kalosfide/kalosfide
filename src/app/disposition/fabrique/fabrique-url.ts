import { KfTexteDef, ValeurTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { PageDef } from 'src/app/commun/page-def';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';

export interface IUrlDef {
    pageDef?: PageDef;
    routes?: ISiteRoutes;
    urlSite?: KfTexteDef;

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
    url(def: IUrlDef): KfTexteDef {
        let segments: string[] = [];
        if (def.pageDef) {
            segments = [def.pageDef.urlSegment];
        }
        if (def.keys) {
            segments = segments.concat(def.keys);
        }
        if (!def.routes) {
            console.log(def);
        }
        const url = def.urlSite
            ? () => def.routes.url(ValeurTexteDef(def.urlSite), segments)
            : () => AppSiteRoutes.url(segments);
        return url;
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
        const defUrl = ValeurTexteDef(this.url(def));
        return url === defUrl;
    }
    /**
     * si l'url à tester est celle de la définition suivie de segments d'url, retourne ces segments
     * @param url url à tester
     * @param def définition d'url
     */
    segmentsDeKey(url: string, def: IUrlDef): string[] {
        const defUrl = ValeurTexteDef(this.url(def));
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
        const defUrl = ValeurTexteDef(this.url(def));
        return url.length >= defUrl.length && url.substr(0, defUrl.length) === defUrl;
    }

}
