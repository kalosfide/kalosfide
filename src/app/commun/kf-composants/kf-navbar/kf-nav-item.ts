import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfNavbar } from './kf-navbar';

export abstract class KfNavItem {
    nom: string;
    protected _parent: KfNavbar | KfNavItem;

    private _inactif = false;
    get inactif(): boolean { return this._inactif; }
    set inactif(valeur: boolean) { this._inactif = valeur; }

    private _visible = true;
    get visible(): boolean { return this._visible; }
    set visible(valeur: boolean) { this._visible = valeur; }

    rafraichit?: () => void;
    protected _quandChange?: () => void;

    private _texte: string;
    private _composant: KfComposant;
    private _items: KfNavItem[];

    constructor(nom: string, parent: KfNavbar | KfNavItem) {
        this.nom = nom;
        this._parent = parent;
    }

    get navbar(): KfNavbar {
        return this._parent.navbar;
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
