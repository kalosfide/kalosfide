import { ItemCompte } from './item-compte';
import { AppSite } from 'src/app/app-site/app-site';
import { NavItemDropDownGroup } from 'src/app/disposition/navbars/nav-item-dropdown-group';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

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
            const roles = this.identifiant
                ? this.identifiant.rolesAccessibles.filter(role => role.rno !== this.identifiant.rnoRoleEnCours)
                : [];
            this.fixeContenus(roles.map(role => {
                const item = new NavItemLien(role.site.url, this);
                item.texte = role.site.url + '@' + AppSite.nom;
                item.url = appRouteur.routeurDeRole(role).url();
                return item;
            }));
        };
    }
}
