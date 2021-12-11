
/**
 * contient les informations sur une page atteignable par une route
 * pour figurer dans l'historique, la page doit avoir un PageDef;
 */
export class PageDef {
    /**
     * path du segment de route menant à la page
     */
    path: string;
    /**
     * nom du paramétre de la route
     */
    nomParam?: string;
    /**
     * texte des liens conduisant à la page
     */
    lien?: string;
    /**
     * texte à afficher dans l'onglet et l'historique du navigateur
     */
    title?: string;
    /**
     * texte à afficher en tête du template
     */
    titre?: string;
}

export class BaseRoutes {
    séparateur = '/';
}
