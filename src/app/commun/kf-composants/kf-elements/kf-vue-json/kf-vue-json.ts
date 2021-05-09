import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';

export function KfNomVueJson(nom: string): string {
    return nom + '_json';
}

export class KfVueJson extends KfComposant {

    objet: () => any;

    constructor(nom: string, objet: () => any) {
        super(KfNomVueJson(nom), KfTypeDeComposant.vuejson);
        this.objet = objet;
    }
    get texte(): string {
        return JSON.stringify(this.objet(), null, 2);
    }
}
