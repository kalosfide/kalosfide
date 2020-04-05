import { KfGéreCss } from '../kf-gere-css';
import { KfComposant } from '../../kf-composant/kf-composant';

export class KfDiv extends KfGéreCss {
    private _enfant: KfDiv | KfComposant;
    private _avecDiv: boolean;

    private constructor() {
        super();
    }

    static enveloppe(composant: KfComposant): KfDiv {
        const div = new KfDiv();
        div._enfant = composant;
        div._avecDiv = false;
        return div;
    }
    static ajouteA(div: KfDiv): KfDiv {
        if (div._avecDiv) {
            return KfDiv.ajouteA(div._enfant as KfDiv);
        } else {
            const nouveau = new KfDiv();
            nouveau._enfant = div._enfant;
            nouveau._avecDiv = false;
            div._enfant = nouveau;
            div._avecDiv = true;
            return nouveau;
        }
    }

    get div(): KfDiv {
        if (this._avecDiv) { return this._enfant as KfDiv; }
    }
    get composant(): KfComposant {
        if (!this._avecDiv) { return this._enfant as KfComposant; }
    }
}
