import { Observable } from 'rxjs';

export type TypeRafraichitStockage = 'aucun' | 'déclenche' | 'rafraichi';

export interface StockageOptions<T> {
    /**
     * fonction à appeler quand on remplace un ancien stock par un nouveau
     */
    quandStockChange?: (ancien: T, nouveau: T) => void;

    /**
     * si vrai, la date est enregistrée à chaque fixation du stock
     */
    avecDate?: boolean;

    /**
     * si 'déclenche', doitRéinitialiser est requis, le stockage déclenche la réinitialisation des stockages dépendants.
     * si 'rafraichi', si dépendDe est absent, le stockage dépend de tous les déclencheurs.
     */
    rafraichit: TypeRafraichitStockage;

    /**
     * Observable qui à chaque émission, déclenche la réinitialisation des stockages dépendants
     */
    doitRéinitialiser?: Observable<any>;

    /**
     * Noms des stockages dont les changements de valeur doivent déclencher la réinitialisation de ce stockage
     */
    dépendDe?: string[];
}
