import { ISiteEtat } from "../modeles/site/site";

/**
 * Objet retourné dans l'erreur 409 Conflict quand la lecture ou l'action sont devenus impossibles
 * car une modification du catalogue est en cours ou a eu lieu.
 */
export class ContexteCatalogue implements ISiteEtat {
    /**
     * vrai quand une modification du catalogue est en cours.
     */
    ouvert: boolean;
    /**
     * Date du début de la modification du catalogue si le site est d'état Catalogue.
     * Date de la fin de la dernière modification du catalogue si le site n'est pas d'état Catalogue.
     */
    dateCatalogue: Date;
}
