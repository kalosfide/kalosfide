import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée, KfValeurEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase, KfTypeContenuPhrasé } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDHTMLEvents, KfTypeDEvenement } from '../../kf-partages/kf-evenements';

export class KfCaseACocher extends KfEntrée {

    /**
     * gére la classe de la div vide d'alignement dans un formulaire horizontal si il y en a une
     */
    private pgéreClasseDivVide: KfGéreCss;

    /** si vrai, la case est après sa légende */
    caseApres: boolean;

    aspect: {
        composant: KfComposant;
        fixe: (valeur: boolean) => void;
    };

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.caseacocher);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.gereValeur.valeur = false;

        this.ajouteClasseDef(
            'form-check-input',
            { nom: 'position-static', active: () => !this.contenuPhrase },
            { nom: 'is-invalid', active: () => this.erreurs.length > 0 },
        );
        this.géreClasseEntree.ajouteClasseDef(
            { nom: 'is-invalid', active: () => this.erreurs.length > 0 },
        );
        const estDansVueTable = () => this.estDansVueTable;
        this.géreClasseEntree.ajouteClasseDef(
            'form-check',
            { nom: 'form-group', active: estDansVueTable },
        );
        this.géreClasseLabel.ajouteClasseDef(
            'form-check-label',
        );
        this.géreClasseLabel.invisibilitéFnc = estDansVueTable;
    }

    get avecLabelAvant(): boolean {
        return this.avecLabel && this.caseApres;
    }

    get avecLabelApres(): boolean {
        return this.avecLabel && !this.caseApres;
    }

    get valeur(): boolean {
        return this.gereValeur.valeur;
    }
    set valeur(valeur: boolean) {
        this.fixeValeur(valeur);
    }

    get classeDiv(): KfNgClasse {
        return this.géreClasseDiv.classe;
    }

    /**
     * gére la classe css de la div vide d'alignement dans un formulaire horizontal si il y en a une
     */
    get géreClasseDivVide() {
        if (!this.pgéreClasseDivVide) {
            this.pgéreClasseDivVide = new KfGéreCss();
        }
        return this.pgéreClasseDivVide;
    }

    /**
     * retourne la classe de la div vide d'alignement dans un formulaire horizontal si il y en a une
     */
    get classeDivVide(): KfNgClasse {
        if (this.pgéreClasseDivVide) {
            return this.pgéreClasseDivVide.classe;
        }
    }

    // données
    depuisForm() {
        this.valeur = this.formControl.value;
    }
    versForm() {
        this.formControl.setValue(this.valeur);
    }

    fixeAspect(composant: KfComposant, fixe: (valeur: boolean) => void) {
        this.aspect = { composant, fixe };
        composant.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            () => {
                this.valeur = !this.valeur;
            }
        );
        this.gereHtml.suitLaValeur = true;
        this.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            () => {
                this.aspect.fixe(this.valeur);
            }
        );
        composant.suitClassesEtStyle(this);
    }
    protected fixeValeur(valeur: KfValeurEntrée) {
        this.gereValeur.valeur = valeur;
        if (this.aspect) {
            this.aspect.fixe(this.gereValeur.valeur);
        }
    }
}
