import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfElement } from '../kf-composant/kf-element';

export class KfDialogueDef {
    /** si défini, une barre de titre affiche ce texte */
    titre?: string;
    /** texte du bouton Ok, par défaut 'Ok' */
    texteOk?: string;
    /** texte du bouton Annuler, par défaut 'Annuler' */
    texteAnnuler?: string;
    /** action exécutée quand le bouton Ok est pressé */
//    actionSiConfirmé?: () => void;
}
