import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { NavBar } from './navbar';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';

export abstract class NavItem {
    nom: string;
    protected _parent: NavBar | NavItem;

    private _inactif = false;
    get inactif(): boolean { return this._inactif; }
    set inactif(valeur: boolean) { this._inactif = valeur; }

    private _visible = true;
    get visible(): boolean { return this._visible; }
    set visible(valeur: boolean) { this._visible = valeur; }

    rafraichit?: () => void;
    protected _quandChange?: () => void;

    constructor(nom: string, parent: NavBar | NavItem) {
        this.nom = nom;
        this._parent = parent;
    }

    get navBar(): NavBar {
        return this._parent.navBar;
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
        if (this._quandChange) {
            this._quandChange();
        }
    }
}
