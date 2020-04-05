import { Menu } from '../disposition/menu/menu';
import { PageDef } from '../commun/page-def';
import { ISiteRoutes } from './site-pages';
import { Site } from '../modeles/site/site';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';

export abstract class SiteMenu extends Menu {
    site: Site;
    routes: ISiteRoutes;

    constructor() {
        super('site');
    }

    protected créeMarqueTexte(): NavItemLien {
        const i = new NavItemLien('texteMarque', this);
        i.lien.ajouteClasseDef('navbar-brand');
        i.rafraichit = () => {
            i.texte = this.site.titre;
            i.url = this.routes.url(this.site.nomSite);
        };
        return i;
    }

    protected créeItemDeSite(pageDef: PageDef, routes: ISiteRoutes): NavItemLien {
        const item = new NavItemLien(pageDef.urlSegment, this);
        item.texte = pageDef.lien;
        item.url = this.routes.url(this.site.nomSite, [pageDef.urlSegment]);
        return item;
    }
}
