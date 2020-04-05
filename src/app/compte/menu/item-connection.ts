import { ItemCompte } from './item-compte';
import { ComptePages, CompteRoutes } from '../compte-pages';
import { PageDef } from 'src/app/commun/page-def';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';

export class ItemConnection extends NavItemLien {
    constructor(parent: ItemCompte) {
        super(ComptePages.connection.urlSegment, parent);
        this.rafraichit = () => {
            const pageDef: PageDef = this.identifiant ? ComptePages.deconnection : ComptePages.connection;
            this.texte = pageDef.lien;
            this.url = this.site
                ? SiteRoutes.urlSite(this.site.nomSite, this.identifiant, CompteRoutes.route([pageDef.urlSegment]))
                : AppSiteRoutes.url(CompteRoutes.route([pageDef.urlSegment]));
        };
    }
}
