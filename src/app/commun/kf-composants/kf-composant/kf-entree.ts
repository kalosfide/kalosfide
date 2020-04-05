import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant } from './kf-composant';
import { FormControl } from '@angular/forms';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfIcone } from '../kf-elements/kf-icone/kf-icone';

export type KfValeurEntrée = boolean | string | number | Date | null;

/**
 * KfEntrée
 * composant avec valeur, sans contenus avec valeur
 */
export abstract class KfEntrée extends KfComposant {

    private pLectureSeule: boolean;
    private pLectureSeuleFnc: () => boolean;

    /**
     * pour afficher au dessous du composant
     */
    private pEtiquetteAide: KfEtiquette;

    /**
     * classe de la div englobante du template
     */
    private pGéreClasseDiv: KfGéreCss;
    /**
     * classe du label du composant
     */
    private pGéreClasseLabel: KfGéreCss;
    /**
     * classe de la div contenant le composant si définie
     */
    private pGéreClasseEntree: KfGéreCss;
    iconeSurvol: KfIcone;

    constructor(nom: string, type: KfTypeDeComposant) {
        super(nom, type);
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

    /**
     * fixe l'étiquette d'aide à afficher au dessous du composant
     */
    set texteAide(etiquette: KfEtiquette) {
        this.pEtiquetteAide = etiquette;
    }
    /**
     * retourne l'étiquette d'aide à afficher au dessous du composant
     */
    get texteAide(): KfEtiquette {
        return this.pEtiquetteAide;
    }

    get avecLabel(): boolean {
        return this.contenuPhrase && this.contenuPhrase.contenus.length > 0;
    }

    /**
     * gére la classe css de la div englobant le template
     */
    get géreClasseDiv(): KfGéreCss {
        if (!this.pGéreClasseDiv) {
            this.pGéreClasseDiv = new KfGéreCss();
            this.pGéreClasseDiv.suitLaVisiblité(this);
        }
        return this.pGéreClasseDiv;
    }

    /**
     * gére la classe css du label du composant
     */
    get géreClasseLabel() {
        if (!this.pGéreClasseLabel) {
            this.pGéreClasseLabel = new KfGéreCss();
        }
        return this.pGéreClasseLabel;
    }

    /**
     * fixe la classe css de la div contenant le composant
     */
    get géreClasseEntree(): KfGéreCss {
        if (!this.pGéreClasseEntree) {
            this.pGéreClasseEntree = new KfGéreCss();
            this.pGéreClasseEntree.suitLaVisiblité(this);
        }
        return this.pGéreClasseEntree;
    }
    ajouteIconeSurvol(icone: KfIcone) {
        this.géreClasseEntree.ajouteClasseDef('avec-survol');
        this.géreClasseEntree.fixeStyleDef('position', 'relative');
        this.iconeSurvol = icone;
    }

    /**
     * retourne la classe css de la div englobant le template, undefined si dans vueTable
     */
    get classeDiv(): KfNgClasse {
        if (this.pGéreClasseDiv && !this.estDansVueTable) {
            return this.pGéreClasseDiv.classe;
        }
    }

    /**
     * retourne la classe css du label du composant, undefined si dans vueTable
     */
    get classeLabel(): KfNgClasse {
        if (this.pGéreClasseLabel && !this.estDansVueTable) {
            return this.pGéreClasseLabel.classe;
        }
    }

    /**
     * retourne la classe css de la div contenant le composant
     */
    get classeEntree(): KfNgClasse {
        if (this.pGéreClasseEntree) {
            return this.pGéreClasseEntree.classe;
        }
    }
}
