import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { NavItem } from './nav-item';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';

export abstract class NavItemFormulaire extends NavItem {
    formulaire: KfSuperGroupe;

    constructor(nom: string, parent: NavItem) {
        super(nom, parent);
    }

    abstract créeFormulaire(): void;

    get composant(): KfComposant { return this.formulaire; }
}
