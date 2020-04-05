
import { ClientRoutes, ClientPages } from '../client/client-pages';
import { SiteMenu } from '../site/site-menu';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';

export class ClientMenu extends SiteMenu {
    routes = ClientRoutes;

    protected créeItemsAction(): (NavItemLien | NavItemDropdown)[] {
        return [
            this.créeItemDeSite(ClientPages.produits, ClientRoutes),
            this.créeItemDeSite(ClientPages.commandes, ClientRoutes),
            this.créeItemDeSite(ClientPages.documents, ClientRoutes),
            this.créeItemDeSite(ClientPages.contact, ClientRoutes),
        ];
    }

}
