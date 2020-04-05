import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { KfTypeBaliseConteneur } from '../../kf-partages/kf-balises-html';

export class KfTexte extends KfElement {
    private texteDef: KfTexteDef;

    /**
     * balises Html à ajouter dans le template autour de la partie rendant le composant
     * doivent être fixées avant d'ajouter le composant à son parent
     */
    pBalisesAAjouter: KfTypeDeBaliseHTML[];

    constructor(nom: string, texteDef: KfTexteDef) {
        super(nom, KfTypeDeComposant.texte);
        this.texteDef = texteDef;
    }

    get texte(): string {
        if (this.texteDef !== undefined) {
            return ValeurTexteDef(this.texteDef);
        }
    }
    fixeTexte(texte: KfTexteDef) {
        this.texteDef = texte;
    }

    get balisesAAjouter(): KfTypeDeBaliseHTML[] {
        if (!this.pBalisesAAjouter && this.avecClassesOuStyle) {
            return [KfTypeDeBaliseHTML.span];
        }
        return this.pBalisesAAjouter;
    }

    set balisesAAjouter(balisesAAjouter: KfTypeDeBaliseHTML[]) {
        this.pBalisesAAjouter = balisesAAjouter;
    }
}
