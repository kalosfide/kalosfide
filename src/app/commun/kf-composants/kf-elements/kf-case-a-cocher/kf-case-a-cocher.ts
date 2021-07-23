import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfEntrée, KfValeurEntrée } from '../kf-entree/kf-entree';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDHTMLEvents, KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../../kf-partages/kf-evenements';

export class KfCaseACocher extends KfEntrée {

    /**
     * gére la classe de la div vide d'alignement dans un formulaire horizontal si il y en a une
     */
    private pgéreClasseDivVide: KfGéreCss;

    /**
     * Composant à afficher à la place de l'input type checkbox rendu invisible
     */
    aspect: KfComposant;
    /**
     * Fonction de mise à jour de l'affichage du composant suivant la valeur
     */
    changeAspect: () => void;

    constructor(nom: string, texteLabel?: KfStringDef) {
        super(nom, KfTypeDeComposant.caseacocher, texteLabel);
        // position par défaut
        this.positionLabel = 'après';
        this.gereValeur.valeur = false;
    }

    get valeur(): boolean {
        return this.gereValeur.valeur;
    }
    set valeur(valeur: boolean) {
        this.fixeValeur(valeur);
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

    /**
     * Définit le composant à afficher à la place de l'input type checkbox rendu invisible.
     * @param aspect composant à afficher
     * @param changeAspect fonction de mise à jour de l'affichage du composant suivant la valeur
     * @param valeurSiIndéfiniEtClic valeur du controle après un clic s'il est indéfini; si présent, la case à cocher à trois états.
     */
    fixeAspect(aspect: KfComposant, changeAspect: () => void, valeurSiIndéfiniEtClic?: true | false) {
        this.aspect = aspect;
        this.changeAspect = changeAspect;
        const quandAspectCliqué = valeurSiIndéfiniEtClic !== undefined
            ? (événement: KfEvenement) => {
                if (!this.inactif) {
                    this.valeur = this.valeur === undefined ? valeurSiIndéfiniEtClic : !this.valeur;
                }
                événement.statut = KfStatutDEvenement.fini;
            }
            : (événement: KfEvenement) => {
                if (!this.inactif) {
                    this.valeur = !this.valeur;
                }
                événement.statut = KfStatutDEvenement.fini;
            }
        aspect.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        aspect.gereHtml.ajouteTraiteur(KfTypeDEvenement.click, quandAspectCliqué);
        aspect.suitClassesEtStyle(this);
        aspect.fixeStyleDef('cursor', 'pointer', () => !this.inactif);
    }

    protected fixeValeur(valeur: KfValeurEntrée) {
        this.gereValeur.valeur = valeur;
        if (this.aspect) {
            this.changeAspect();
        }
    }
}
