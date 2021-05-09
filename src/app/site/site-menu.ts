import { Menu } from '../disposition/menu/menu';
import { PageDef } from '../commun/page-def';
import { ISiteRoutes } from './site-pages';
import { Site } from '../modeles/site/site';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';
import { FournisseurPages } from '../fournisseur/fournisseur-pages';

export abstract class SiteMenu extends Menu {
    site: Site;
    routes: ISiteRoutes;

    constructor() {
        super('site');
    }

    protected créeMarqueTexte(): NavItemLien {
        const i = new NavItemLien('texteMarque', this);
        i.lien.ajouteClasse('navbar-brand');
        i.rafraichit = () => {
            i.texte = this.site.titre;
            i.url = this.routes.url(this.site.url);
        };
        return i;
    }

    protected créeItem(pageDef: PageDef): NavItemLien {
        const item = new NavItemLien(pageDef.urlSegment, this);
        item.texte = pageDef.lien;
        item.url = this.routes.url(this.site.url, [pageDef.urlSegment]);
        return item;
    }

    protected créeItemSite(...items: NavItemLien[]): NavItemDropdown {
        const itemSite = new NavItemDropdown('site', this);
        itemSite.texte = 'Site';
        items.forEach(item => itemSite.ajoute(item));
        return itemSite;
    }

    protected créeItemDeSite(pageDef: PageDef): NavItemLien {
        const item = new NavItemLien(pageDef.urlSegment, this);
        item.texte = pageDef.lien;
        item.url = this.routes.url(this.site.url, [FournisseurPages.site.urlSegment, pageDef.urlSegment]);
        return item;
    }
}
