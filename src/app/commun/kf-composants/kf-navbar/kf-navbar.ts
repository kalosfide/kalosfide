import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfNavItem } from './kf-nav-item';
import { KfIcone } from '../kf-elements/kf-icone/kf-icone';

export class KfNavbar extends KfComposant {

    brandables: KfNavItem[];
    iconeCache: KfIcone;
    cachables: KfNavItem[];

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.navbar);
    }

    get navbar(): KfNavbar {
        return this;
    }

}
