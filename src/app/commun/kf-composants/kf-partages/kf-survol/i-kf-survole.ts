import { KfComposant } from "../../kf-composant/kf-composant";

export interface IKfSurvole extends KfComposant {
    /**
     * Composant de n'importe quel type pour accéder aux propriétés css et à l'élément html du fond
     */
     fond: KfComposant;
    créeFond(): void;
}

