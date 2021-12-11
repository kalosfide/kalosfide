import { Menu } from '../disposition/menu/menu';
import { PageDef } from '../commun/page-def';
import { ItemCompte } from '../compte/menu/item-compte';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';
import { NavItemDropDownGroup } from '../disposition/navbars/nav-item-dropdown-group';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { AdminPages } from './admin-pages';
import { AppPages } from '../app-pages';

export class AdminMenu extends Menu {
    constructor() {
        super('app');
    }

    private créeItemApp(pageDef: PageDef): NavItemLien {
        const item = new NavItemLien(pageDef.path, this);
        item.texte = pageDef.lien;
        item.url = Fabrique.url.appRouteur.admin.url(pageDef.path);
        return item;
    }

    protected créeMarqueTexte(): NavItemLien {
        const i = new NavItemLien('texteMarque', this);
        i.lien.ajouteClasse('navbar-brand');
        i.texte = AppPages.admin.lien;
        i.url = Fabrique.url.appRouteur.admin.url();
        return i;
    }

    protected créeItemsAction(): (NavItemLien | NavItemDropdown)[] {
        return [
            this.créeItemApp(AdminPages.utilisateurs),
            this.créeItemApp(AdminPages.fournisseurs),
            this.créeItemApp(AdminPages.nouveaux),
        ];
    }

    protected créeItemCompte(): NavItemDropdown {
        const i = new ItemCompte(this);
        return i;
    }

}
