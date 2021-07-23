import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée } from '../kf-entree/kf-entree';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfNgClasse, KfNgClasseDef } from '../../kf-partages/kf-gere-css-classe';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';

export abstract class KfInput extends KfEntrée {
    // données
    texteParDéfaut: '';
    abstract typeDInput: string;
    private pComposantAvant: KfComposant;
    private pGéreClasseComposantAvant: KfGéreCss;

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
    get classeComposantAvant(): KfNgClasse {
        if (this.pGéreClasseComposantAvant) {
            return this.pGéreClasseComposantAvant.classe;
        }
    }
    fixeComposantAvant(composant: KfComposant, ...classeDefs: (KfStringDef | KfNgClasseDef)[]) {
        this.pComposantAvant = composant;
        if (classeDefs.length > 0) {
            this.pGéreClasseComposantAvant = new KfGéreCss();
            this.pGéreClasseComposantAvant.ajouteClasse(...classeDefs);
        }
    }

}
