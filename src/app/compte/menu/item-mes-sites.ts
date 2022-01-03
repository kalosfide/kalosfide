import { ItemCompte } from './item-compte';
import { AppSite } from 'src/app/app-site/app-site';
import { NavItemDropDownGroup } from 'src/app/disposition/navbars/nav-item-dropdown-group';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatRole } from 'src/app/modeles/role/etat-role';

export class ItemMesSites extends NavItemDropDownGroup {
    constructor(parent: ItemCompte) {
        super('mesSites', parent);
        this.rafraichit = () => {
            if (!this.identifiant) {
                this.fixeContenus([]);
                return;
            }
            const appRouteur = Fabrique.url.appRouteur;
            if (this.identifiant.estAdministrateur) {
                if (this.navBar.nom === 'admin') {
                    this.fixeContenus([]);
                    return;
                } else {
                    const item = new NavItemLien('admin', this);
                    item.texte = 'administration' + '@' + AppSite.nom;
                    item.url = appRouteur.admin.url();
                    this.fixeContenus([item]);
                    return;
                }
            }
            const sites = this.identifiant
                ? this.identifiant.sites.filter(site => site.id !== this.identifiant.idSiteEnCours && site.fournisseur.etat !== EtatRole.fermé)
                : [];
            this.fixeContenus(sites.map(site => {
                const item = new NavItemLien(site.url, this);
                item.texte = site.url + '@' + AppSite.nom;
                item.url = appRouteur.routeurDeSite(site).url();
                return item;
            }));
        };
    }
}
