import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfLien } from '../kf-lien/kf-lien';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfNgbDropdownGroup extends KfComposant {
    constructor(nom: string) {
        super(nom, KfTypeDeComposant.ngbDropdownGroup);
        this.contenuPhrase = new KfContenuPhrase(this);
    }

    ajoute(composant: KfComposant) {
        throw new Error(`On ne peut pas ajouter de composant au KfNgbDropdownGroup ${this.nom}`);
    }

    fixeContenus(contenus: KfLien[]) {
        this.contenuPhrase.contenus = contenus;
        contenus.forEach(item => item.ajouteClasse('dropdown-item'));
    }

}
