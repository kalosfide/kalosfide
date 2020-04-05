import { Menu } from '../disposition/menu/menu';
import { PageDef } from '../commun/page-def';
import { AppSiteRoutes, AppSitePages } from './app-site-pages';
import { AppSite } from './app-site';
import { AppRoutes } from '../app-pages';
import { ItemCompte } from '../compte/menu/item-compte';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';
import { NavItemDropDownGroup } from '../disposition/navbars/nav-item-dropdown-group';

export class AppSiteMenu extends Menu {
    constructor() {
        super('app');
    }

    private créeItemApp(pageDef: PageDef): NavItemLien {
        const item = new NavItemLien(pageDef.urlSegment, this);
        item.texte = pageDef.lien;
        item.url = AppSiteRoutes.url([pageDef.urlSegment]);
        return item;
    }

    protected créeMarqueTexte(): NavItemLien {
        const i = new NavItemLien('texteMarque', this);
        i.lien.ajouteClasseDef('navbar-brand');
        i.texte = AppSite.texte;
        i.url = AppRoutes.url();
        return i;
    }

    protected créeItemsAction(): (NavItemLien | NavItemDropdown)[] {
        return [
            this.créeItemApp(AppSitePages.sites),
            this.créeItemApp(AppSitePages.contact),
            this.créeItemApp(AppSitePages.apropos),
        ];
    }

    private créeItemDevenirFournisseur(parent: ItemCompte): NavItemDropDownGroup {
        const itemDevenir = new NavItemDropDownGroup('devenir', parent);
        const itemFournisseur = new NavItemLien(AppSitePages.devenirFournisseur.urlSegment, this);
        itemFournisseur.url = AppSiteRoutes.url([AppSitePages.devenirFournisseur.urlSegment]);
        itemFournisseur.texte = AppSitePages.devenirFournisseur.lien;
        itemDevenir.ajoute(itemFournisseur);
        return itemDevenir;
    }

    protected créeItemCompte(): NavItemDropdown {
        const i = new ItemCompte(this);
        i.ajoute(this.créeItemDevenirFournisseur(i));
        return i;
    }

}
