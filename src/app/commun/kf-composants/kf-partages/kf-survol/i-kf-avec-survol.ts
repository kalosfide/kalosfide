import { KfComposant } from "../../kf-composant/kf-composant";
import { KfGéreCss } from "../kf-gere-css";
import { IKfSurvole } from "./i-kf-survole";
import { KfSurvol } from "./kf-survol";

/**
 * Interface implémenté par les composants qui peuvent être survolés.
 * Un composant avec survol doit être un conteneur de contenus phrasés ou contenu dans un conteneur
 */
export interface IKfAvecSurvol extends KfComposant {
    survol: KfSurvol;
    /**
     * KfGéreCss de l'élément html qui contient le composant à survoler l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     * Le composant lui même si c'est un conteneur.
     */
    conteneurSurvolé: KfGéreCss;
    /**
     * Array des KfGéreCss des contenus (autre que l'icone) de l'élément html qui contient
     * l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    contenusSurvolés: KfGéreCss[];
    /**
     * Ajoute une icone ou un BootstrapSpinner que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    créeSurvol(survole: IKfSurvole): void; 
}
