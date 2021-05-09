import { KfTypeDeComposant, KfTypeDeValeur } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { FormControl } from '@angular/forms';
import { KfComposantGereValeur } from '../../kf-composant/kf-composant-gere-valeur';
import { KfEtiquette } from '../kf-etiquette/kf-etiquette';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { IKfAvecIconeSurvol, KfIcone } from '../kf-icone/kf-icone';
import { KfClavierToucheEnfoncée } from '../../kf-partages/kf-clavier/kf-clavier-touche-enfoncee';
import { KfTypeDHTMLEvents, KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../../kf-partages/kf-evenements';
import { IKfEntreeFocusClavier } from './i-kf-entree-focus-clavier';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfAvecLabel } from '../../kf-composant/kf-avecLabel';

export type KfValeurEntrée = boolean | string | number | Date | null;

/**
 * KfEntrée
 * composant avec valeur, sans contenus avec valeur
 */
export abstract class KfEntrée extends KfAvecLabel implements IKfAvecIconeSurvol {

    private pLectureSeule: boolean;
    private pLectureSeuleFnc: () => boolean;

    /**
     * Icone affichée par dessus le composant que l'on peut montrer ou cacher.
     */
    private pIconeSurvol: KfIcone;

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
     * Icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    get iconeSurvol(): KfIcone {
        return this.pIconeSurvol;
    }
    /**
     * Ajoute une icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    ajouteIconeSurvol(icone: KfIcone) {
        this.pIconeSurvol = icone;
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
        if (def.toucheDébutEdition || def.lectureSeuleSiPasFocus) {
            this.lectureSeule = true;
        }
        const focusPris = () => {
            console.log('entrée focus pris', this);
            valeurAvantFocus = this.gereValeur.valeur;
            if (!def.toucheDébutEdition || def.lectureSeuleSiPasFocus) {
                this.lectureSeule = false;
            }
        };
        const sauvegarde = () => {
            if (!this.formulaireParent.gereValeur.invalide && this.gereValeur.valeur !== valeurAvantFocus) {
                const subscription = def.sauvegarde().subscribe(
                    ok => {
                        subscription.unsubscribe();
                        if (!ok) {
                            this.gereValeur.valeur = valeurAvantFocus;
                            valeurAvantFocus = undefined;
                        }
                    }
                );
            } else {
                this.gereValeur.valeur = valeurAvantFocus;
                valeurAvantFocus = undefined;
            }

        };
        const focusPerdu = () => {
            console.log('entrée focus perdu', this);
            if (!this.gereValeur.invalide) {
                if (def.sauveQuandPerdFocus) {
                    sauvegarde();
                }
            } else {
                this.gereValeur.valeur = valeurAvantFocus;
                valeurAvantFocus = undefined;
            }
            if (def.toucheDébutEdition || def.lectureSeuleSiPasFocus) {
                this.lectureSeule = true;
            }
        };
        this.gereHtml.suitLeFocus(focusPris, focusPerdu);

        if (def.toucheDébutEdition || def.toucheRétablit || def.toucheSauvegarde) {
            const toucheEnfoncée = (event: KeyboardEvent): boolean => {
                if (KfClavierToucheEnfoncée.sontIdentiques(def.toucheDébutEdition, event)) {
                    this.lectureSeule = false;
                    return true;
                }
                if (KfClavierToucheEnfoncée.sontIdentiques(def.toucheRétablit, event)) {
                    this.gereValeur.valeur = valeurAvantFocus;
                    if (def.toucheDébutEdition) {
                        this.lectureSeule = true;
                    }
                    return true;
                }
                if (KfClavierToucheEnfoncée.sontIdentiques(def.toucheSauvegarde, event)) {
                    sauvegarde();
                    if (def.toucheDébutEdition) {
                        this.lectureSeule = true;
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
