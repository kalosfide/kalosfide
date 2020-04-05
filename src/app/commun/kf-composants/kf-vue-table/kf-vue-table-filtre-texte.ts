import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import {
    KfListeDeroulanteTexte} from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfBBtnToolbarInputGroup } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export class KfVueTableFiltreTexte<T> extends KfVueTableFiltreBase<T> {
    private pListe: KfListeDeroulanteTexte;

    constructor(nom: string, valide: (t: T, valeur: string) => boolean) {
        super(nom);
        this.pValide = valide;

        this.pListe = new KfListeDeroulanteTexte(nom + '_L');
    }

    get liste(): KfListeDeroulanteTexte {
        return this.pListe;
    }

    get composant(): KfBBtnToolbarInputGroup {
        return this.pListe;
    }
}
