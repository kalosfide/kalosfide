import { Observable } from 'rxjs';

export type TypeRafraichitStockage = 'aucun' | 'déclenche' | 'rafraichi';

export interface StockageOptions<T> {
    /**
     * Fonction à appeler quand on remplace un ancien stock par un nouveau qui est différent.
     * Un stockage déclencheur de réinitialisation doit faire émettre déclencheVidage pendant l'éxécution de quandStockChange.
     */
    quandStockChange?: (ancien: T, nouveau: T) => void;

    /**
     * A chaque émission de déclencheVidage, les stockages dépendants sont réinitialisés.
     * Si présent, le stockage est déclencheur et rafraichi est absent.
     */
    déclencheVidage?: Observable<any>;

    /**
     * Si rafraichi est true, le stockage est dépendant et déclencheVidage est absent.
     */
    rafraichi?: boolean;

    /**
     * Noms des stockages dont les changements de valeur doivent déclencher la réinitialisation de ce stockage
     * Si présent, rafraichi doit être true et déclencheVidage absent.
     */
    dépendDe?: string[];
}
