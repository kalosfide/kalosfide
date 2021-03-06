import { KfComposant } from '../kf-composant/kf-composant';
import {
    KfListeDeroulanteTexte} from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';
import { KfVueTableLigne } from './kf-vue-table-ligne';

export class KfVueTableFiltreTexte<T> extends KfVueTableFiltreBase<T> {
    private pListe: KfListeDeroulanteTexte;

    constructor(nom: string, valide: (t: T, valeur: string) => boolean) {
        super(nom);
        this.pValide = (ligne: KfVueTableLigne<T>) => {
            const valeur = this.pListe.valeur;
            return valeur ? valide(ligne.item, valeur) : true;
        };

        this.pListe = new KfListeDeroulanteTexte(nom + '_L');
    }

    get liste(): KfListeDeroulanteTexte {
        return this.pListe;
    }

    get composant(): KfComposant {
        return this.pListe;
    }
}
