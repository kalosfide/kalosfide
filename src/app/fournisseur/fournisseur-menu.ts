
import { FournisseurRoutes, FournisseurPages } from './fournisseur-pages';
import { SiteMenu } from '../site/site-menu';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';

export class FournisseurMenu extends SiteMenu {
    routes = FournisseurRoutes;

    protected créeItemsAction(): NavItemLien[] {
        return [
            this.créeItem(FournisseurPages.livraison),
            this.créeItem(FournisseurPages.facture),
            this.créeItem(FournisseurPages.documents),
            this.créeItemSite(
                this.créeItemDeSite(FournisseurPages.catalogue),
                this.créeItemDeSite(FournisseurPages.clients),
                this.créeItemDeSite(FournisseurPages.site),
            )
        ];
    }

}
