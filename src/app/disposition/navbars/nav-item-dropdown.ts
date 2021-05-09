import { KfNgbDropdown } from 'src/app/commun/kf-composants/kf-elements/kf-ngb-dropdown/kf-ngb-dropdown';
import { NavItemDropDownGroup } from './nav-item-dropdown-group';
import { NavBar } from './navbar';
import { NavItemUlLi } from './nav-item-ul-li';
import { NavItemContenu } from './nav-item-contenu';

export class NavItemDropdown extends NavItemContenu {

    private pItems: (NavItemContenu | NavItemDropDownGroup)[];

    constructor(nom: string, parent: NavBar | NavItemUlLi) {
        super(nom, parent, new KfNgbDropdown(nom));
        this.pItems = [];
        this.pQuandChange = () => {
            this.pItems.forEach(item => item.quandChange());
        };
    }

    fermeQuandClick() {
        this.pItems.forEach(i => i.fermeQuandClick());
    }

    get dropdown(): KfNgbDropdown {
        return this.pComposant as KfNgbDropdown;
    }

    ajoute(item: NavItemContenu | NavItemDropDownGroup) {
        this.dropdown.ajoute(item.composant);
        this.pItems.push(item);
    }
}
