import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfGroupe } from '../../kf-groupe/kf-groupe';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../../kf-partages/kf-gere-css-style';
import { IKfSurvole } from '../../kf-partages/kf-survol/i-kf-survole';
import { KfEtiquette } from '../kf-etiquette/kf-etiquette';
import { KfIconeTaille } from '../kf-icone/kf-icone-types';

export class KfBootstrapSpinner extends KfComposant implements IKfSurvole {
    classeSpinner: string;

    /**
     * Etiquette pour accéder aux propriétés css et html du fond
     */
    fond: KfEtiquette;

    constructor(nom: string, spinnerType: 'border' | 'grow') {
        super(nom, KfTypeDeComposant.bsSpinner);
        this.classeSpinner = `spinner-${spinnerType}`;
    }

    taille(valeur: KfIconeTaille) {
        if (valeur === 'lg') {
            // 'lg' est pour les icones Fontawesome
            return;
        }
        if (valeur === 'sm') {
            this.ajouteClasse(`${this.classeSpinner}-sm`);
        } else {
            const dim = '' + valeur + 'rem';
            this.fixeStyleDef('width', dim);
            this.fixeStyleDef('height', dim);
        }
    }

    créeFond() {
        this.fond = new KfEtiquette(`${this.nom}_fond`);
    }

}
