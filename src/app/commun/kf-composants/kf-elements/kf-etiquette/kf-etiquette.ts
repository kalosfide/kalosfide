import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export class KfEtiquette extends KfComposant {

    private plabelFor: KfComposant;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.etiquette);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
    }

    labelise(composant: KfComposant) {
        if (composant.nom === '') {
            throw new Error('Un composant avec label doit avoir un nom');
        }
        this.plabelFor = composant;
        this.suitLaVisiblité(composant);
    }

    get labelFor(): string {
        if (this.plabelFor) {
            return this.plabelFor.nom;
        }
    }

    private pBaliseHtml: KfTypeDeBaliseHTML;

    get baliseHtml(): KfTypeDeBaliseHTML {
        if (this.pBaliseHtml) {
            return this.pBaliseHtml;
        }
        if (this.avecClassesOuStyle) {
            return KfTypeDeBaliseHTML.span;
        }
    }
    set baliseHtml(baliseHtml: KfTypeDeBaliseHTML) {
        this.pBaliseHtml = baliseHtml;
    }

}
