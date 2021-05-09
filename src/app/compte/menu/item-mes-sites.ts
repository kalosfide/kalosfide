import { ItemCompte } from './item-compte';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSite } from 'src/app/app-site/app-site';
import { NavItemDropDownGroup } from 'src/app/disposition/navbars/nav-item-dropdown-group';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';

export class ItemMesSites extends NavItemDropDownGroup {
    constructor(parent: ItemCompte) {
        super('mesSites', parent);
        this.rafraichit = () => {
            let sites = this.identifiant ? this.identifiant.sites : [];
            if (this.site) {
                sites = sites.filter(s => s.url !== this.site.url);
            }
            this.fixeContenus(sites.map(s => {
                const item = new NavItemLien(s.url, this);
                item.texte = s.url + '@' + AppSite.nom;
                item.url = SiteRoutes.urlDIdentifiant(s.url, this.identifiant);
                return item;
            }));
        };
    }
}
