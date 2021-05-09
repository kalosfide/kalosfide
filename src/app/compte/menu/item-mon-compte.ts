import { ItemCompte } from './item-compte';
import { ComptePages, CompteRoutes } from '../compte-pages';
import { SiteRoutes } from 'src/app/site/site-pages';
import { AppSiteRoutes } from 'src/app/app-site/app-site-pages';
import { NavItemDropDownGroup } from 'src/app/disposition/navbars/nav-item-dropdown-group';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';

export class ItemMonCompte extends NavItemDropDownGroup {

    constructor(parent: ItemCompte) {
        super('monCompte', parent);

        this.rafraichit = () => {
            const contenus: NavItemLien[] = [];
            if (this.identifiant) {
                const changeMotDePasse = new NavItemLien(ComptePages.changeMotDePasse.urlSegment, this);
                changeMotDePasse.texte = ComptePages.changeMotDePasse.lien;
                changeMotDePasse.url = AppSiteRoutes.url(CompteRoutes.route([ComptePages.changeMotDePasse.urlSegment]));
                contenus.push(changeMotDePasse);
                const changeEmail = new NavItemLien(ComptePages.changeEmail.urlSegment, this);
                changeEmail.texte = ComptePages.changeEmail.lien;
                changeEmail.url = AppSiteRoutes.url(CompteRoutes.route([ComptePages.changeEmail.urlSegment]));
                contenus.push(changeEmail);

                const itemMonCompte = new NavItemLien(ComptePages.gestion.urlSegment, this);
                itemMonCompte.texte = ComptePages.gestion.lien;
                itemMonCompte.url = this.site
                    ? SiteRoutes.urlDIdentifiant(this.site.url, this.identifiant, CompteRoutes.route([ComptePages.gestion.urlSegment]))
                    : AppSiteRoutes.url(CompteRoutes.route([ComptePages.gestion.urlSegment]));
                contenus.push(itemMonCompte);
            }
            this.fixeContenus(contenus);
        };
    }
}
