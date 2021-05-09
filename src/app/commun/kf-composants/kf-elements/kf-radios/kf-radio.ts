import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfRadios } from './kf-radios';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfAvecLabel } from '../../kf-composant/kf-avecLabel';

export class KfRadio extends KfAvecLabel {

    _valeur: any;

    constructor(nom: string, valeur: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.radio, texte);
        this._valeur = valeur;
        this.positionLabel = 'après';
    }

    get valeur(): any {
        return this._valeur;
    }

    get radios(): KfRadios {
         return this.parent as KfRadios;
    }

}
