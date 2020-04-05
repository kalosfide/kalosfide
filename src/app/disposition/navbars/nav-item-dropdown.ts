import { KfNgbDropdown } from 'src/app/commun/kf-composants/kf-elements/kf-ngb-dropdown/kf-ngb-dropdown';
import { NavItemLien } from './nav-item-lien';
import { NavItemDropDownGroup } from './nav-item-dropdown-group';
import { NavBar } from './navbar';
import { NavItemUlLi } from './nav-item-ul-li';
import { NavItemContenu } from './nav-item-contenu';

export class NavItemDropdown extends NavItemContenu {

    private _items: (NavItemContenu | NavItemDropDownGroup)[];

    constructor(nom: string, parent: NavBar | NavItemUlLi) {
        super(nom, parent, new KfNgbDropdown(nom));
        this._items = [];
        this._quandChange = () => {
            this._items.forEach(item => item.quandChange());
        };
    }

    fermeQuandClick() {
        this._items.forEach(i => i.fermeQuandClick());
    }

    get dropdown(): KfNgbDropdown {
        return this._composant as KfNgbDropdown;
    }

    ajoute(item: NavItemContenu | NavItemDropDownGroup) {
        this.dropdown.ajoute(item.composant);
        this._items.push(item);
    }
}
