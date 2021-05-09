/**
 * Objet à passer au ngClass d'Angular pour appliquer des classes à un élément Html.
 */
export interface KfNgClasse { [noms: string]: boolean | (() => boolean); }
export function KfNgClasseCombine(ngClasse1: KfNgClasse, ngClasse2: KfNgClasse): KfNgClasse {
    const ngClasse: KfNgClasse = {};
    for (const nom in ngClasse1) {
        if (Object.prototype.hasOwnProperty.call(ngClasse1, nom)) {
            ngClasse[nom] = ngClasse1[nom];
        }
    }
    for (const nom in ngClasse2) {
        if (Object.prototype.hasOwnProperty.call(ngClasse2, nom)) {
            ngClasse[nom] = ngClasse2[nom];
        }
    }
    return ngClasse;
}

/**
 * Objet définissant un champ d'un KfNgClasse par le nom de la classe (nom) et éventuellement
 * la fonction sans paramétre d'activation (active).
 */
export class KfNgClasseDef {
    /**
     * Nom de la classe.
     */
    nom: string;
    /**
     * Fonction sans paramétre qui retourne true quand la classe doit être appliquée.
     */
    active?: () => boolean;
}

/**
 * Objet définissant un champ de KfNgClasses dépendant d'objet par le nom de la classe (nom) et éventuellement
 * la fonction d'activation d'un paramétre de type T (active).
 */
export class KfNgClasseDefDe<T> {
    /**
     * Nom de la classe.
     */
    nom: string;
    /**
     * Fonction d'un paramétre de type T qui retourne true quand la classe doit être appliquée.
     */
    active?: (t: T) => boolean;
}
