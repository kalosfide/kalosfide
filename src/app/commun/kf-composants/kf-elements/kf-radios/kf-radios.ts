import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfEntrée } from '../kf-entree/kf-entree';
import { KfGereTabIndex } from '../../kf-composant/kf-composant-gere-tabindex';
import { KfStringDef } from '../../kf-partages/kf-string-def';

export class KfRadios extends KfEntrée {

    avecNgBootstrap: boolean;

    constructor(nom: string, texteLabel?: KfStringDef) {
        super(nom, KfTypeDeComposant.radios, texteLabel);
    }

    ajoute(composant: KfComposant) {
        if (composant.type === KfTypeDeComposant.radio) {
            this.noeud.Ajoute(composant.noeud);
            return;
        }
        throw new Error(`On ne peut ajouter que des KfRadio à ${this.nom}`);
    }

    navigueAuClavier() {
        this.gereTabIndex = new KfGereTabIndex(this, {
            contenus: () => this.contenus,
            liéAChoisi: () => this.liéAChoisi()
        });
    }

    liéAChoisi(): KfComposant {
        const enCours = this.contenus.find(
            (c: KfComposant): boolean => {
                const input = c.gereHtml.htmlElement as HTMLInputElement;
                return input ? input.checked : false;
            });
        return enCours ? enCours : this.contenus[0];
    }
    // évènements
    get traiteClic(): (cliqué: KfComposant) => void { return null; }

    // données

    get valeur(): string {
        return this.litValeur() as string;
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

}
