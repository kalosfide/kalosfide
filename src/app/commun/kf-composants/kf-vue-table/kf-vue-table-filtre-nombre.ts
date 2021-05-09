import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import {
    KfListeDeroulanteNombre} from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfBBtnToolbarInputGroup } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';
import { KfVueTableLigne } from './kf-vue-table-ligne';

export class KfVueTableFiltreNombre<T> extends KfVueTableFiltreBase<T> {
    private pListe: KfListeDeroulanteNombre;

    constructor(nom: string, valide: (t: T, valeur: number) => boolean) {
        super(nom);
        this.pValide = (ligne: KfVueTableLigne<T>) => {
            const valeur = this.pListe.valeur;
            return valeur ? valide(ligne.item, valeur) : true;
        };

        this.pListe = new KfListeDeroulanteNombre(nom + '_L');
    }

    get liste(): KfListeDeroulanteNombre {
        return this.pListe;
    }

    get composant(): KfBBtnToolbarInputGroup {
        return this.pListe;
    }
}
