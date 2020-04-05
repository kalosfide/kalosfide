import { KfComposant } from './kf-composant/kf-composant';

export const KF_SUIT_LE_FOCUS = false;
export const KF_SUIT_LE_FOCUS_FORM_ET_CLIC = true;

/**
 * rassemble les paramètres que doivent partager tous les composants d'un même document HTML
 */
class KfComposantDocumentContexte {

    /**
     * si vrai les htmlElements de tous les composants du contexte ont des méthodes onfocus et on blur et un tabindex
     * faux par défaut
     */
    suitLeFocus = false;
    /**
     * même chose mais seulement pour les formulaires, les élément d'entrée et les avecClic
     * par défaut vrai
     */
    suitLeFocusFormEtClic = true;
    /**
     * composant dont le htmlElement a le focus s'il y en a un
     */
    focusComposant: KfComposant;
    /**
     * composant dont le htmlElement devra prendre le focus quand focusComposant le perdra
     */
    prochainFocusComposant: KfComposant;
    /**
     * appelé par le onfocus des htmlElements
     */
    quandPrendFocus(composant: KfComposant) {
        this.focusComposant = composant;
        this.prochainFocusComposant = null;
//        console.log('focus', KfdocumentContexte.focusComposant, KfdocumentContexte.prochainFocusComposant);
    }
    /**
     * appelé par le onblur des htmlElements
     */
    quandPerdFocus(composant: KfComposant) {
//        console.log('blur', KfdocumentContexte.focusComposant, KfdocumentContexte.prochainFocusComposant);
        if (composant === this.focusComposant) {
            if (this.prochainFocusComposant) {
                this.prochainFocusComposant.gereHtml.htmlElement.focus();
            }
        } else {
//            console.log('pas focusComposant');
            this.focusComposant = null;
            this.prochainFocusComposant = null;
        }
    }


}
export const KfDocumentContexte = new KfComposantDocumentContexte;
