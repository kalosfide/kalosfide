import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { NavBar } from './navbar';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';

export abstract class NavItem {
    nom: string;
    protected pParent: NavBar | NavItem;

    private pInactif = false;
    get inactif(): boolean { return this.pInactif; }
    set inactif(valeur: boolean) { this.pInactif = valeur; }

    private pVisible = true;
    get visible(): boolean { return this.pVisible; }
    set visible(valeur: boolean) { this.pVisible = valeur; }

    rafraichit?: () => void;
    protected pQuandChange?: () => void;

    constructor(nom: string, parent: NavBar | NavItem) {
        this.nom = nom;
        this.pParent = parent;
    }

    get navBar(): NavBar {
        return this.pParent.navBar;
    }

    get site(): Site {
        return this.navBar.site;
    }
    get identifiant(): Identifiant {
        return this.navBar.identifiant;
    }

    abstract get composant(): KfComposant;

    quandChange() {
        if (this.rafraichit) {
            this.rafraichit();
        }
        if (this.pQuandChange) {
            this.pQuandChange();
        }
    }
}
