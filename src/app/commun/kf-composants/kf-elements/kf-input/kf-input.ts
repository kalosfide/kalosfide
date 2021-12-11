import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../kf-entree/kf-entree';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfComposant } from '../../kf-composant/kf-composant';

export abstract class KfInput extends KfEntrée {
    // données
    texteParDéfaut: '';
    abstract typeDInput: string;
    private pComposantAvant: KfComposant;

    /**
     * pour l'attribut placeholder
     */
    placeholder: string;

    constructor(nom: string, texteLabel?: KfStringDef) {
        super(nom, KfTypeDeComposant.input, texteLabel);
        // position par défaut
        this.positionLabel = 'avant';
    }

    get estVide(): boolean {
        const valeur = this.litValeur();
        return valeur === null || valeur === undefined || valeur === '';
    }

    get composantAvant(): KfComposant {
        return this.pComposantAvant;
    }

    fixeComposantAvant(composant: KfComposant) {
        this.pComposantAvant = composant;
    }

}
