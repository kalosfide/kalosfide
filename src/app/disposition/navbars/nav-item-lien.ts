import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { NavBar } from './navbar';
import { NavItemDropdown } from './nav-item-dropdown';
import { NavItemDropDownGroup } from './nav-item-dropdown-group';
import { NavItemUlLi } from './nav-item-ul-li';
import { NavItemContenu } from './nav-item-contenu';

export class NavItemLien extends NavItemContenu {

    constructor(nom: string, parent: NavBar | NavItemDropdown | NavItemDropDownGroup | NavItemUlLi) {
        super(nom, parent, new KfLien(nom));
        this.lien.routerLinkActive = true;
        this.lien.ajouteClasseDef(
            'nav-link',
            { nom: 'disabled', active: () => this.inactif },
        );
    }

    get lien(): KfLien {
        return this._composant as KfLien;
    }

    set url(url: KfTexteDef) {
        this.lien.fixeRoute(url);
    }
}
