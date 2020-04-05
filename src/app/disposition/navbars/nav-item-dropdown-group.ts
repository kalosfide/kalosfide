import { KfNgbDropdownGroup } from 'src/app/commun/kf-composants/kf-elements/kf-ngb-dropdown/kf-ngb-dropdown';
import { NavItem } from './nav-item';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { NavItemLien } from './nav-item-lien';
import { NavItemDropdown } from './nav-item-dropdown';

export class NavItemDropDownGroup extends NavItem {
    private _dropdownGroup: KfNgbDropdownGroup;

    private _items: NavItemLien[];

    constructor(nom: string, parent: NavItemDropdown) {
        super(nom, parent);
        this._dropdownGroup = new KfNgbDropdownGroup(nom);
        this._items = [];
        this._quandChange = () => {
            this._items.forEach(item => item.quandChange());
        };
    }

    fermeQuandClick() {
        this._items.forEach(i => i.fermeQuandClick());
    }

    get composant(): KfComposant {
        return this._dropdownGroup;
    }
    get dropdownGroup(): KfNgbDropdownGroup {
        return this._dropdownGroup;
    }

    ajoute(itemLien: NavItemLien) {
        this._dropdownGroup.ajoute(itemLien.lien);
        this._items.push(itemLien);
        itemLien.lien.ajouteClasseDef('dropdown-item');
    }
}
