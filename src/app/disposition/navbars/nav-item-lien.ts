import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { NavBar } from './navbar';
import { NavItemDropdown } from './nav-item-dropdown';
import { NavItemDropDownGroup } from './nav-item-dropdown-group';
import { NavItemUlLi } from './nav-item-ul-li';
import { NavItemContenu } from './nav-item-contenu';
import { KfCssClasse } from 'src/app/commun/kf-composants/kf-partages/kf-css-classe';

export class NavItemLien extends NavItemContenu {

    constructor(nom: string, parent: NavBar | NavItemDropdown | NavItemDropDownGroup | NavItemUlLi) {
        super(nom, parent, new KfLien(nom));
        this.lien.avecRouterLinkActive(KfCssClasse.actif, true);
        this.lien.ajouteClasse(
            'nav-link',
            { nom: 'disabled', active: () => this.inactif },
        );
    }

    get lien(): KfLien {
        return this.pComposant as KfLien;
    }

    set url(url: KfStringDef) {
        this.lien.fixeRoute(url);
    }
}
