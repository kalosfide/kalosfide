import { ItemCompte } from './item-compte';
import { ComptePages, CompteRoutes } from '../compte-pages';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';

export class ItemAjoute extends NavItemLien {
    constructor(parent: ItemCompte) {
        super(ComptePages.ajoute.urlSegment, parent);
        this.texte = ComptePages.ajoute.lien;
        this.url = AppSiteRoutes.url(CompteRoutes.route([ComptePages.ajoute.urlSegment]));
        this.rafraichit = () => {
            this.pComposant.visible = !this.identifiant;
        };
    }
}
