import { KfTypeDeComposant } from '../kf-composants-types';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfComposant } from './kf-composant';

export abstract class KfAvecLabel extends KfComposant {

    /**
     * classe de la div englobante du template
     */
     private pGéreClasseDiv: KfGéreCss;
     /**
      * classe de la div contenant le composant si définie
      */
     private pGéreClasseEntree: KfGéreCss;
 
    /**
     * Etiquette contenant le contenu phrasé, le GéreCss et le GéreHtml du label du composant
     */
     private pEtiquetteLabel: KfEtiquette;
     positionLabel: 'avant' | 'après';
 
     /**
      * pour afficher au dessous du composant
      */
     private pEtiquetteAide: KfEtiquette;

     constructor(nom: string, type: KfTypeDeComposant, texteLabel?: KfTexteDef) {
        super(nom, type);
        this.pEtiquetteLabel = new KfEtiquette('', texteLabel);
        this.pEtiquetteLabel.labelise(this);
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
     * Gére classes et styles de la div contenant le composant.
     * Créé quand lu la première fois.
     */
    get géreClasseEntree(): KfGéreCss {
        if (!this.pGéreClasseEntree) {
            this.pGéreClasseEntree = new KfGéreCss();
            this.pGéreClasseEntree.suitLaVisiblité(this);
        }
        return this.pGéreClasseEntree;
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
     * retourne la classe css de la div contenant le composant
     */
    get classeEntree(): KfNgClasse {
        if (this.pGéreClasseEntree) {
            return this.pGéreClasseEntree.classe;
        }
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

    /**
     * Gére le contenu phrasé, la classe css et l'élément Html du label du composant
     */
    get label(): KfEtiquette {
        return this.pEtiquetteLabel;
    }

    /**
     * Si vrai le label est ajouté au template.
     * Faux si l'étiquette n'a pas de contenu ou si son nePasAfficher est vrai
     */
    get avecLabel(): boolean {
        return !this.pEtiquetteLabel.nePasAfficher && this.pEtiquetteLabel.contenuPhrase.contenus.length > 0;
    }

    get avecLabelAvant(): boolean {
        return this.avecLabel && this.positionLabel === 'avant';
    }

    get avecLabelApres(): boolean {
        return this.avecLabel && this.positionLabel === 'après';
    }

}
