import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfRadio } from './kf-radio';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfGereTabIndex } from '../../kf-composant/kf-composant-gere-tabindex';

export class KfRadios extends KfEntrée {

    avecNgBootstrap: boolean;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.radios);
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
