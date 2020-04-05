import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfRadios } from './kf-radios';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfEtiquette } from '../kf-etiquette/kf-etiquette';

export class KfRadio extends KfElement {

    _valeur: any;

    /**
     * pour afficher au dessous de l'élément
     */
    private _etiquetteAide: KfEtiquette;

    constructor(nom: string, valeur: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.radio);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this._valeur = valeur;
    }

    get valeur(): any {
        return this._valeur;
    }

    get radios(): KfRadios {
         return this.parent as KfRadios;
    }

    /**
     * fixe l'étiquette d'aide à afficher au dessous du composant
     */
    set texteAide(etiquette: KfEtiquette) {
        this._etiquetteAide = etiquette;
    }
    /**
     * retourne l'étiquette d'aide à afficher au dessous du composant
     */
    get texteAide(): KfEtiquette {
        return this._etiquetteAide;
    }

}
