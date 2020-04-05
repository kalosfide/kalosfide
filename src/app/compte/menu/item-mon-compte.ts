import { ItemCompte } from './item-compte';
import { ComptePages, CompteRoutes } from '../compte-pages';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';
import { NavItemDropDownGroup } from 'src/app/disposition/navbars/nav-item-dropdown-group';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';

export class ItemMonCompte extends NavItemDropDownGroup {

    constructor(parent: ItemCompte) {
        super('monCompte', parent);

        this.rafraichit = () => {
            if (this.identifiant) {
                const itemMonCompte = new NavItemLien(ComptePages.gestion.urlSegment, this);
                itemMonCompte.texte = ComptePages.gestion.lien;
                itemMonCompte.url = this.site
                    ? SiteRoutes.urlSite(this.site.nomSite, this.identifiant, CompteRoutes.route([ComptePages.gestion.urlSegment]))
                    : AppSiteRoutes.url(CompteRoutes.route([ComptePages.gestion.urlSegment]));
                this.ajoute(itemMonCompte);
            }
        };
    }
}
