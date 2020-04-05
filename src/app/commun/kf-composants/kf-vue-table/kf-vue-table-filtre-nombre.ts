import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import {
    KfListeDeroulanteNombre} from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfBBtnToolbarInputGroup } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export class KfVueTableFiltreNombre<T> extends KfVueTableFiltreBase<T> {
    private pListe: KfListeDeroulanteNombre;

    constructor(nom: string, valide: (t: T, valeur: number) => boolean) {
        super(nom);
        this.pValide = valide;

        this.pListe = new KfListeDeroulanteNombre(nom + '_L');
    }

    get liste(): KfListeDeroulanteNombre {
        return this.pListe;
    }

    get composant(): KfBBtnToolbarInputGroup {
        return this.pListe;
    }
}
