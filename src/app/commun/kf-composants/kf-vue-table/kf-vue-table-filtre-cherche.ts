import { KfInputTexte } from '../kf-elements/kf-input/kf-input-texte';
import { KfVueTableFiltreBase } from './kf-vue-table-filtre-base';

export class KfVueTableFiltreCherche<T> extends KfVueTableFiltreBase<T> {
    private pTexte: KfInputTexte;

    constructor(nom: string, texte: (t: T) => string) {
        super(nom);
        this.pValide = (t: T, valeur: string) => texte(t).toLowerCase().indexOf(valeur.toLowerCase()) > -1;

        this.pTexte = new KfInputTexte(nom + '_T');
    }

    get texte(): KfInputTexte {
        return this.pTexte;
    }

    get composant(): KfInputTexte {
        return this.pTexte;
    }
}
