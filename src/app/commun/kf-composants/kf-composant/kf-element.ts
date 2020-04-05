import { KfTypeDeComposant } from '../kf-composants-types';
import { KfComposant } from './kf-composant';

/**
 * KfElement
 * composant sans contenus et sans valeur
 */
export abstract class KfElement extends KfComposant {
    constructor(nom: string, type: KfTypeDeComposant) {
        super(nom, type);
    }

}
