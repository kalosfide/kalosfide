import { DataUtile } from './data-utile';
import { ISiteRoutes, iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { PageDef } from '../page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { ComptePages, CompteRoutes } from 'src/app/compte/compte-pages';
import { ClientRoutes } from 'src/app/client/client-pages';
import { FournisseurRoutes } from 'src/app/fournisseur/fournisseur-pages';
import { AppPages } from 'src/app/app-pages';

export class DataUtileUrl {
    protected parent: DataUtile;

    constructor(dataUtile: DataUtile) {
        this.parent = dataUtile;
    }

    id(texteKey: string) {
        return 'kfvt' + texteKey;
    }

    __urlDef(routes: ISiteRoutes, pageDef?: PageDef, texteKey?: string, retour?: boolean): IUrlDef {
        const urlDef: IUrlDef = {
            pageDef,
            routes,
            urlSite: () => this.parent.site.url,
        };
        if (texteKey) {
            if (retour) {
                urlDef.fragment = this.id(texteKey);
            } else {
                urlDef.keys = [texteKey];
            }
        }
        return urlDef;
    }

    dePageDef(routes: ISiteRoutes, pageDef: PageDef): IUrlDef {
        return this.__urlDef(routes, pageDef);
    }

    déconnection(): IUrlDef {
        const site = this.parent.service.navigation.litSiteEnCours();
        const identifiant = this.parent.service.identification.litIdentifiant();
        const routes = identifiant.estClient(site) ? ClientRoutes : FournisseurRoutes;
        return this.__urlDef(iSiteRoutePlusSegments(routes, [AppPages.compte.urlSegment]), ComptePages.deconnection);
    }

}
