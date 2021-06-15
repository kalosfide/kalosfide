import { Observable } from "rxjs";
import { KfClavierTouche } from "../../kf-partages/kf-clavier/kf-clavier-touche";
import { KfClavierToucheEnfoncée } from "../../kf-partages/kf-clavier/kf-clavier-touche-enfoncee";

export interface IKfEntreeFocusClavier {

    /**
     * Si présent, fonction à appeler pour enregistrer les modifications d'une entrée
     */
    sauvegarde?: () => Observable<boolean>;

    /**
     * Si présent et si l'entrée est en cours d'édition quand cette touche est enfoncée,
     * la valeur avant édition est rétablie et, si la touche de début d'édition est définie, l'entrée redevient en lecture seule.
     */
    toucheRétablit?: KfClavierTouche | KfClavierToucheEnfoncée;

    /**
     * Si présent et si l'entrée est en cours d'édition et si la ligne a un formulaire valide quand cette touche est enfoncée,
     * la fonction de sauvegarde est appelée et, si la touche de début d'édition est définie, l'entrée redevient en lecture seule.
     */
    toucheSauvegarde?: KfClavierTouche | KfClavierToucheEnfoncée;

    /**
     * Si présent et vrai et si l'entrée est en cours d'édition, quand elle perd le focus
     * si la ligne a un formulaire valide, la fonction de sauvegarde est appelée sinon la valeur avant édition de cette entrée est rétablie 
     */
    sauveQuandPerdFocus?: boolean;

}
