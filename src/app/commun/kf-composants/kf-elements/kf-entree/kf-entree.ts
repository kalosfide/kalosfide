import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
import { FormControl } from '@angular/forms';
import { KfComposantGereValeur } from '../../kf-composant/kf-composant-gere-valeur';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfIcone } from '../kf-icone/kf-icone';
import { KfClavierToucheEnfoncée } from '../../kf-partages/kf-clavier/kf-clavier-touche-enfoncee';
import { KfTypeDHTMLEvents, KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../../kf-partages/kf-evenements';
import { IKfEntreeFocusClavier } from './i-kf-entree-focus-clavier';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfAvecLabel } from '../../kf-composant/kf-avecLabel';
import { IKfAvecSurvol } from '../../kf-partages/kf-survol/i-kf-avec-survol';
import { KfSurvol } from '../../kf-partages/kf-survol/kf-survol';
import { IKfSurvole } from '../../kf-partages/kf-survol/i-kf-survole';

export type KfValeurEntrée = boolean | string | number | Date | null;

/**
 * KfEntrée
 * composant avec valeur, sans contenus avec valeur
 */
export abstract class KfEntrée extends KfAvecLabel implements IKfAvecSurvol {

    private pLectureSeule: boolean;
    private pLectureSeuleFnc: () => boolean;

    /**
     * Composant affichant une icone ou un BootstrapSpinner centré au dessus de l'entrée que l'on peut montrer ou cacher.
     */
    private pSurvol: KfSurvol;

    constructor(nom: string, type: KfTypeDeComposant, texteLabel?: KfTexteDef) {
        super(nom, type, texteLabel);
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecEntree);
    }

    protected litValeur(): KfValeurEntrée {
        return this.gereValeur.valeur;
    }
    protected fixeValeur(valeur: KfValeurEntrée) {
        this.gereValeur.valeur = valeur;
    }

    aPourValeur(valeur: KfValeurEntrée): boolean {
        return valeur === this.gereValeur.valeur;
    }

    get aUneValeur(): boolean {
        return this.gereValeur.valeur !== null && this.gereValeur.valeur !== undefined;
    }

    // INTERFACE
    // le template comprend:
    //  un div englobante si _classeDiv est défini
    //      ou un label si le ContenuPhrase n'est pas vide (input)
    //      ou un legend si le ContenuPhrase n'est pas vide (listeDeroulante)
    //      ou un div vide si _classDivVide est défini (case à cocher pour aligner en colonne)
    //      un div si classeEntree est défini
    //          l'entrée
    //      fin div
    //      _etiquetteAide si défini
    //      un div pour les erreurs si avecInvalidFeedback
    // fin div

    get formControl(): FormControl {
        return this.abstractControl as FormControl;
    }

    /**
     *  méthodes pour fixer la façon de déterminer lectureSeule
     */
    set lectureSeule(lectureSeule: boolean) {
        this.pLectureSeule = lectureSeule;
    }
    /**
     * permet d'affecter l'attribut readonly au DOM element
     */
    get lectureSeule(): boolean {
        return (this.pLectureSeuleFnc) ? this.pLectureSeuleFnc() : this.pLectureSeule;
    }
    set lectureSeuleFnc(lectureSeuleFnc: () => boolean) {
        this.pLectureSeuleFnc = lectureSeuleFnc;
    }

    /// Interface IKfAvecIconeSurvol ///

    /**
     * Composant affichant une icone ou un BootstrapSpinner centré au dessus de l'entrée que l'on peut montrer ou cacher.
     */
     get survol(): KfSurvol {
        return this.pSurvol;
    }
    /**
     * Crée le composant affichant une icone ou un BootstrapSpinner centré au dessus de l'entrée que l'on peut montrer ou cacher.
     */
    créeSurvol(survole: IKfSurvole) {
        this.pSurvol = new KfSurvol(this, survole);
    }
    /**
     * KfGéreCss de l'élément html qui contient l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    get conteneurSurvolé(): KfGéreCss {
        return this.géreClasseEntree;
    }
    /**
     * Array des KfGéreCss des contenus (autre que l'icone) de l'élément html qui contient
     * l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    get contenusSurvolés(): KfGéreCss[] {
        return [this];
    }
    /// Fin Interface IKfAvecIconeSurvol ///

    /**
     * Fixe le comportement vis à vis des événements du focus et de certaines touches du clavier
     */
    prépareFocusClavier(def: IKfEntreeFocusClavier) {
        let valeurAvantFocus: any;
        const focusPris = () => {
            console.log('entrée focus pris', this);
            valeurAvantFocus = this.gereValeur.valeur;
        };
        const sauvegarde = (rétablirSiEchoue?: 'rétablirSiEchoue') => {
                const subscription = def.sauvegarde().subscribe(
                    ok => {
                        subscription.unsubscribe();
                        if (ok) {
                            valeurAvantFocus = this.gereValeur.valeur;
                        } else {
                            if (rétablirSiEchoue) {
                                this.gereValeur.valeur = valeurAvantFocus;
                            }
                        }
                    }
                );
        };
        const focusPerdu = () => {
            console.log('entrée focus perdu', this);
            if (this.gereValeur.valeur !== valeurAvantFocus) {
                if (def.sauveQuandPerdFocus) {
                    if (!this.formulaireParent.gereValeur.invalide) {
                        sauvegarde('rétablirSiEchoue');
                    }
                } else {
                    this.gereValeur.valeur = valeurAvantFocus;
                }
            }
            valeurAvantFocus = undefined;
        };
        this.gereHtml.suitLeFocus(focusPris, focusPerdu);

        if (def.toucheRétablit || def.toucheSauvegarde) {
            const toucheEnfoncée = (event: KeyboardEvent): boolean => {
                if (KfClavierToucheEnfoncée.sontIdentiques(def.toucheRétablit, event)) {
                    this.gereValeur.valeur = valeurAvantFocus;
                    return true;
                }
                if (KfClavierToucheEnfoncée.sontIdentiques(def.toucheSauvegarde, event)) {
                    if (!this.formulaireParent.gereValeur.invalide && this.gereValeur.valeur !== valeurAvantFocus) {
                        sauvegarde();
                    }
                    return true;
                }
                return false;
            }
            this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keydown);
            this.gereHtml.ajouteTraiteur(KfTypeDEvenement.keydown,
                (événement: KfEvenement) => {
                    if (toucheEnfoncée(événement.parametres as KeyboardEvent)) {
                        événement.statut = KfStatutDEvenement.fini;
                    }
                });
        }
    }
}
