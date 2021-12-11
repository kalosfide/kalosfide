import { Menu } from '../disposition/menu/menu';
import { PageDef } from '../commun/page-def';
import { NavItemLien } from '../disposition/navbars/nav-item-lien';
import { NavItemDropdown } from '../disposition/navbars/nav-item-dropdown';
import { FournisseurPages } from '../fournisseur/fournisseur-pages';
import { Routeur } from '../commun/routeur';

export abstract class SiteMenu extends Menu {
    routeur: Routeur;

    constructor() {
        super('site');
    }

    protected créeMarqueTexte(): NavItemLien {
        const i = new NavItemLien('texteMarque', this);
        i.lien.ajouteClasse('navbar-brand');
        i.rafraichit = () => {
            i.texte = this.site.titre;
            i.url = this.routeur.url();
        };
        return i;
    }

    protected créeItem(pageDef: PageDef): NavItemLien {
        const item = new NavItemLien(pageDef.path, this);
        item.texte = pageDef.lien;
        item.url = this.routeur.url(pageDef.path);
        return item;
    }

    protected créeItemSite(...items: NavItemLien[]): NavItemDropdown {
        const itemSite = new NavItemDropdown('site', this);
        itemSite.texte = 'Gestion';
        items.forEach(item => itemSite.ajoute(item));
        return itemSite;
    }

    protected créeItemDeSite(pageDef: PageDef): NavItemLien {
        const item = new NavItemLien(pageDef.path, this);
        item.texte = pageDef.lien;
        item.url = this.routeur.url(FournisseurPages.gestion.path, pageDef.path);
        return item;
    }
}
