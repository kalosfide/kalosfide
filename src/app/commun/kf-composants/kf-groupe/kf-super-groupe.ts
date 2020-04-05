import { KfGroupe } from './kf-groupe';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfInput, KfTypeDInput } from '../kf-elements/kf-input/kf-input';
import { KfInputDateTemps } from '../kf-elements/kf-input/kf-input-date-temps';
import { IKfVueTable } from '../kf-vue-table/kf-vue-table';

/**
 * racine d'un arbre de disposition
 */
export class KfSuperGroupe extends KfGroupe {

    constructor(nom: string) {
        super(nom);
    }

    /**
     * les composants sont ajoutés dans la disposition
     * les noeudV sont créés avec les géreValeur
     * les racineV sont désignés
     * les noeudV des composants ayant été ajoutés à la valeur d'un composant ont un parent
     *
     * Il faut:
     *  créer la liste des racineV
     *  ajouter un noeudV qui n'est pas une racineV et qui n'a pas de parentV au noeudV
     *  du plus proche ancêtre de disposition qui en a un
     *  lancer gereValeur.prepare pour chaque racine
     * Pour la disposition ensérer dans des balises
     */
    quandTousAjoutés() {
        const arbresDesValeurs: KfComposant[] = [];
        const créeArbresDeValeurs = (composant: KfComposant, parentV: KfComposant) => {
            let pV = parentV;
            /** debug */
            if (!composant) {
                console.log(parentV);
            }
            if (composant.gereValeur) {
                if (composant.estRacineV) {
                    arbresDesValeurs.push(composant);
                    pV = composant;
                } else {
                    const noeudV = composant.gereValeur.noeudV;
                    if (!noeudV.parent) {
                        if (!parentV) {
                            throw new Error(`noeudV sans racineV: ${composant.nom}`);
                        }
                        parentV.gereValeur.noeudV.Ajoute(noeudV);
                    }
                    if (composant.estGroupePourLaValeur) {
                        pV = composant;
                    } else {
                        if (composant.type === KfTypeDeComposant.input) {
                            if ((composant as KfInput).typeDInput === KfTypeDInput.datetemps) {
                                const datetemps = composant as KfInputDateTemps;
                                créeArbresDeValeurs(datetemps.inputDate, null);
                                créeArbresDeValeurs(datetemps.inputTemps, null);
                            }
                        }
                    }
                }
            }
            if (composant.type === KfTypeDeComposant.vuetable) {
                const vueTable = composant as unknown as IKfVueTable;
                if (vueTable.groupeDesOutils) {
                    créeArbresDeValeurs(vueTable.groupeDesOutils, null);
                }
            }
            const noeudD = composant.noeud;
            let enfant = noeudD.enfant;
            while (enfant) {
                créeArbresDeValeurs(enfant.objet as KfComposant, pV);
                enfant = enfant.suivant;
            }
        };
        if (this.gereValeur) {
            this.gereValeur.estRacineV = true;
        }
        créeArbresDeValeurs(this, null);

        arbresDesValeurs.forEach(racineV => {
            // crée les valeurs et les controles, fixe les validateurs
            racineV.gereValeur.prépareRacineV();
            // fixe les évènements concernant la valeur
            racineV.gereHtml.prépareRacineV();
        });
    }
}
