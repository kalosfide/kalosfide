import { KfComposant } from '../kf-composant/kf-composant';
import { KfVueTableOutils } from './kf-vue-table-outils';
import { IKfVueTableOutil } from './kf-vue-table-outil';
import { KfVueTableLigne } from './kf-vue-table-ligne';

export abstract class KfVueTableFiltreBase<T> implements IKfVueTableOutil<T> {
    private pNom: string;

    protected pValide: (ligne: KfVueTableLigne<T>) => boolean;

    constructor(nom: string) {
        this.pNom = nom;
    }

    get nom(): string {
        return this.pNom;
    }

    abstract get composant(): KfComposant;

    get filtreActif(): boolean {
        const valeur = this.composant.gereValeur.valeur;
        return valeur !== undefined && valeur !== null && valeur !== '';
    }

    get valide(): (ligne: KfVueTableLigne<T>) => boolean {
        return this.pValide;
    }

    protected _initialise(parent: KfVueTableOutils<T>) {
        this.composant.estRacineV = true;
        this.composant.gereHtml.suitLaValeur();
    }

    initialise(parent: KfVueTableOutils<T>) {
        this._initialise(parent);
    }

}
