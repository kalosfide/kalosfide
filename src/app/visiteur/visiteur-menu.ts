import { SiteMenu } from '../site/site-menu';
import { VisiteurRoutes, VisiteurPages } from './visiteur-pages';
import { ItemCompte } from '../compte/menu/item-compte';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';
import { NavItemDropDownGroup } from '../disposition/navbars/nav-item-dropdown-group';

export class VisiteurMenu extends SiteMenu {
    routes = VisiteurRoutes;

    protected créeItemsAction(): NavItemLien[] {
        return [
            this.créeItemDeSite(VisiteurPages.produits, VisiteurRoutes),
            this.créeItemDeSite(VisiteurPages.contact, VisiteurRoutes),
            this.créeItemDeSite(VisiteurPages.apropos, VisiteurRoutes),
        ];
    }

    protected créeItemCompte(): NavItemDropdown {
        const i = new ItemCompte(this);
        const devenir = new NavItemDropDownGroup('devenir', i);
        i.ajoute(devenir);
        const client = new NavItemLien(VisiteurPages.devenirClient.urlSegment, this);
        client.texte = VisiteurPages.devenirClient.lien;
        client.url = VisiteurRoutes.url(this.menu.site.nomSite, [VisiteurPages.devenirClient.urlSegment]);
        devenir.ajoute(client);
        return i;
    }

}
