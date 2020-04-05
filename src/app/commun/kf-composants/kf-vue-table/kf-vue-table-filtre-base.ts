import { KfTypeDEvenement } from '../kf-partages/kf-evenements';
import { KfVueTableOutils } from './kf-vue-table-outils';
import { IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnToolbarInputGroup } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export abstract class KfVueTableFiltreBase<T> implements IKfVueTableOutil<T> {
    private pNom: string;

    protected pValide: (t: T, valeur: string | number) => boolean;

    constructor(nom: string) {
        this.pNom = nom;
    }

    get nom(): string {
        return this.pNom;
    }

    abstract get composant(): KfBBtnToolbarInputGroup;

    get filtreActif(): boolean {
        const valeur = this.composant.gereValeur.valeur;
        return valeur !== undefined && valeur !== null && valeur !== '';
    }

    get valide(): (t: T) => boolean {
        if (this.pValide) {
            return (t: T) => {
                const valeur = this.composant.valeur;
                return valeur ? this.pValide(t, valeur) : true;
            };
        }
    }

    initialise(parent: KfVueTableOutils<T>) {
        this.composant.estRacineV = true;
        this.composant.gereHtml.suitLaValeur = true;
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            () => {
                parent.appliqueFiltres();
            });
    }

}
