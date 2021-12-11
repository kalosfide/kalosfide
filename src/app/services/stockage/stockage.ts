
/**
 * Objet permettant à un service de stocker des données dans la mémoire du navigateur sans être obligé de les recharger à chaque utilisation.
 */
export interface Stockage<T> {
    /**
     * Nom du stockage unique dans l'application
     */
    nom: string;

    /**
     * Retourne vrai s'il n'y a pas d'objet stocké dans la mémoire du navigateur.
     */
    estVide(): boolean;

    /**
     * Retourne l'objet stocké dans la mémoire du navigateur s'il y en a un, null sinon.
     */
    litStock(): T;

    /**
     * Si l'objet à stocker est différent de l'objet stocké, sauve l'objet à stocker dans la mémoire du navigateur
     * et appelle quandStockChange.
     * @param stock objet à stocker
     */
    fixeStock(stock: T): void;

    /**
     * Supprime l'objet stocké
     */
    vide(): void;

}
