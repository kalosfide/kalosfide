import { Menu } from '../disposition/menu/menu';
import { PageDef } from '../commun/page-def';
import { AppSitePages } from './app-site-pages';
import { AppSite } from './app-site';
import { ItemCompte } from '../compte/menu/item-compte';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';
import { NavItemDropDownGroup } from '../disposition/navbars/nav-item-dropdown-group';
import { Fabrique } from '../disposition/fabrique/fabrique';

export class AppSiteMenu extends Menu {
    constructor() {
        super('app');
    }

    private créeItemApp(pageDef: PageDef): NavItemLien {
        const item = new NavItemLien(pageDef.path, this);
        item.texte = pageDef.lien;
        item.url = Fabrique.url.appRouteur.appSite.url(pageDef.path);
        return item;
    }

    protected créeMarqueTexte(): NavItemLien {
        const i = new NavItemLien('texteMarque', this);
        i.lien.ajouteClasse('navbar-brand');
        i.texte = AppSite.texte;
        i.url = Fabrique.url.appRouteur.url();
        return i;
    }

    protected créeItemsAction(): (NavItemLien | NavItemDropdown)[] {
        return [
            this.créeItemApp(AppSitePages.peuple),
            this.créeItemApp(AppSitePages.contact),
            this.créeItemApp(AppSitePages.apropos),
        ];
    }

    private créeItemNouveauSite(parent: ItemCompte): NavItemDropDownGroup {
        const itemNouveau = new NavItemDropDownGroup('devenir', parent);
        const itemFournisseur = new NavItemLien(AppSitePages.nouveauSite.path, this);
        itemFournisseur.url = Fabrique.url.appRouteur.appSite.url(AppSitePages.nouveauSite.path);
        itemFournisseur.texte = AppSitePages.nouveauSite.lien;
        itemNouveau.fixeContenus([]);
        itemNouveau.rafraichit = () => {
            itemNouveau.fixeContenus(!(itemNouveau.identifiant && itemNouveau.identifiant.estAdministrateur) ? [itemFournisseur] : []);
        };
        return itemNouveau;
    }

    protected créeItemCompte(): NavItemDropdown {
        const i = new ItemCompte(this);
        i.ajoute(this.créeItemNouveauSite(i));
        return i;
    }

}
