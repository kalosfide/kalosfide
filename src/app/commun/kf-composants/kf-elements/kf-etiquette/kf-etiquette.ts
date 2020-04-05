import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfEtiquette extends KfElement {

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.etiquette);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
    }

    private _baliseHtml: KfTypeDeBaliseHTML;

    get baliseHtml(): KfTypeDeBaliseHTML {
        if (this._baliseHtml) {
            return this._baliseHtml;
        }
        if (this.avecClassesOuStyle) {
            return KfTypeDeBaliseHTML.span;
        }
    }
    set baliseHtml(baliseHtml: KfTypeDeBaliseHTML) {
        this._baliseHtml = baliseHtml;
    }

}
