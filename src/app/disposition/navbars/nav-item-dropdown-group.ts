import { KfNgbDropdownGroup } from 'src/app/commun/kf-composants/kf-elements/kf-ngb-dropdown/kf-ngb-dropdown-group';
import { NavItem } from './nav-item';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { NavItemLien } from './nav-item-lien';
import { NavItemDropdown } from './nav-item-dropdown';

export class NavItemDropDownGroup extends NavItem {
    private pDropdownGroup: KfNgbDropdownGroup;

    private pItems: NavItemLien[];

    constructor(nom: string, parent: NavItemDropdown) {
        super(nom, parent);
        this.pDropdownGroup = new KfNgbDropdownGroup(nom);
        this.pItems = [];
        this.pQuandChange = () => {
            this.pItems.forEach(item => item.quandChange());
        };
    }

    fermeQuandClick() {
        this.pItems.forEach(i => i.fermeQuandClick());
    }

    get composant(): KfComposant {
        return this.pDropdownGroup;
    }
    get dropdownGroup(): KfNgbDropdownGroup {
        return this.pDropdownGroup;
    }

    fixeContenus(contenus: NavItemLien[]) {
        this.pDropdownGroup.fixeContenus(contenus.map(c => c.lien));
        this.pItems = contenus;
    }
}
