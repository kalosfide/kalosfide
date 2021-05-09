/**
 * Objet retourné dans l'erreur 409 Conflict quand la lecture ou l'action sont devenus impossibles
 * car une modification du catalogue est en cours ou a eu lieu.
 */
export class ContexteCatalogue {
    /**
     * Etat du site
     */
    etatSite: string;
    /**
     * Date du catalogue (DATENULLE si une modification est en cours)
     */
    dateCatalogue: Date;
}
