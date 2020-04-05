import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';

export function KfNomVueJson(nom: string): string {
    return nom + '_json';
}

export class KfVueJson extends KfElement {

    objet: () => any;

    constructor(nom: string, objet: () => any) {
        super(KfNomVueJson(nom), KfTypeDeComposant.vuejson);
        this.objet = objet;
    }
    get texte(): string {
        return JSON.stringify(this.objet(), null, 2);
    }
}
