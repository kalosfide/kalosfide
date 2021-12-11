
import { ClientPages } from '../client/client-pages';
import { SiteMenu } from '../site/site-menu';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';
import { Fabrique } from '../disposition/fabrique/fabrique';

export class ClientMenu extends SiteMenu {

    constructor() {
        super();
        this.routeur = Fabrique.url.appRouteur.client;
    }

    protected créeItemsAction(): (NavItemLien | NavItemDropdown)[] {
        return [
            this.créeItem(ClientPages.catalogue),
            this.créeItem(ClientPages.commandes),
            this.créeItem(ClientPages.documents),
            this.créeItem(ClientPages.contact),
        ];
    }

}
