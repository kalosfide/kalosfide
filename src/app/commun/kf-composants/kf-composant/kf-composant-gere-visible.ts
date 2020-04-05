import { KfComposant } from './kf-composant';
import { Observable } from 'rxjs';

export class KfComposantGereVisible {

    composant: KfComposant;

    private _contenus: () => KfComposant[];
    aucunContenuVisible: () => boolean;
    private _indexSeulVisible: number | (() => number);

    constructor(composant: KfComposant) {
        this.composant = composant;
    }

    /**
     * permet de rendre invisible (class: kf-invisible = {display: none}) tous les contenus sauf un
     * les contenus doivent avoir pour parent this.composant
     * @param contenus fonction retournant l'array des composants gérés
     * @param fncIndexSeulVisible fonction retournant l'index du seul visible s'il y en a un
     */
    avecUnSeulContenuVisible(
        contenus: () => KfComposant[],
        fncIndexSeulVisible: () => number,
        aucunContenuVisible?: () => boolean
    ) {
        this._contenus = contenus;
        this._indexSeulVisible = fncIndexSeulVisible;
        this.aucunContenuVisible = aucunContenuVisible;
    }

    get contenus(): KfComposant[] {
        return this._contenus();
    }

    /**
     * retourne true si avec un seul contenu visible qui n'est pas celui passé en paramètre
     * @param contenu est dans contenus
     */
    private cacheContenu(contenu: KfComposant): boolean {
        if (this.aucunContenuVisible && this.aucunContenuVisible()) {
            return true;
        }
        let seulContenuVisible: KfComposant = null;
        if (this._indexSeulVisible) {
            if (typeof (this._indexSeulVisible) === 'number') {
                seulContenuVisible = this.contenus[this._indexSeulVisible];
            } else {
                seulContenuVisible = this.contenus[this._indexSeulVisible()];
            }
        }
        if (seulContenuVisible) {
            return contenu !== seulContenuVisible;
        } else {
            return false;
        }
    }

    /**
     * estCachéParParent(): boolean
     *  le conteneur parent peut avoir une propriété seulContenuVisible
     */
    private get estCachéParParent(): boolean {
        let gereVisible: KfComposantGereVisible;
        if (this.composant.parent) {
            gereVisible = this.composant.parent.gereVisible;
        } else {
            if (this.composant.listeParent) {
                gereVisible = this.composant.listeParent.composant.gereVisible;
            }
        }
        return gereVisible && gereVisible.cacheContenu(this.composant);
    }

}
