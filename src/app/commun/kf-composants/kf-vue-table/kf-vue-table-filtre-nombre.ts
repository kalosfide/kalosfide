import {
    KfListeDeroulanteNombre} from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfComposant } from '../kf-composant/kf-composant';

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

    get composant(): KfComposant {
        return this.pListe;
    }
}
