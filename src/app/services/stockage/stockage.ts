import { StockageOptions } from './stockage-options';
import { stockageAbsent } from './stockage-absent';

export interface Stockage<T> {
    nom: string;

    estNull(): boolean;

    litStock(): T;

    litDate(): Date;

    fixeStock(stock: T): void;

    initialise(): void;

}
