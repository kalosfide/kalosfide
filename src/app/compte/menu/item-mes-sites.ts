import { ItemCompte } from './item-compte';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSite } from 'src/app/app-site/app-site';
import { NavItemDropDownGroup } from 'src/app/disposition/navbars/nav-item-dropdown-group';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';

export class ItemMesSites extends NavItemDropDownGroup {
    constructor(parent: ItemCompte) {
        super('mesSites', parent);
        this.rafraichit = () => {
            let roles = this.identifiant ? this.identifiant.roles : [];
            if (this.site) {
                roles = roles.filter(r => r.nomSite !== this.site.nomSite);
            }
            roles.forEach(r => {
                const item = new NavItemLien(r.nomSite, this);
                item.texte = r.nomSite + '@' + AppSite.nom;
                item.url = SiteRoutes.urlSite(r.nomSite, this.identifiant);
               this.ajoute(item);
            });
        };
    }
}
