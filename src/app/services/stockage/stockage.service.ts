import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { TypeRafraichitStockage, StockageOptions } from './stockage-options';
import { Stockage } from './stockage';
import { stockageAbsent } from './stockage-absent';

interface IStockage {

    nom: string;
    initialise(): void;
}

class CStockage<T> implements IStockage, Stockage<T> {
    private _nom: string;
    private _avecDate: boolean;
    private _quandStockChange: (ancien: T, nouveau: T) => void;

    constructor(nom: string, options?: StockageOptions<T>) {
        this._nom = nom;
        if (options) {
            this._avecDate = options.avecDate;
            this._quandStockChange = options.quandStockChange;
        }
    }

    get nom(): string {
        return this._nom + 'date';
    }

    get nomDate(): string {
        return this._nom + 'date';
    }

    public estNull(): boolean {
        return stockageAbsent(this._nom);
    }

    public litDate(): Date {
        return this.estNull() || !this._avecDate ? null : new Date(window.sessionStorage[this.nomDate]);
    }

    public litStock(): T {
        return this.estNull() ? null : JSON.parse(window.sessionStorage[this._nom]) as T;
    }

    public fixeStock(stock: T): void {
        const ancien = this.litStock();
        const changé = ancien === null
            ? stock !== null || stock !== undefined
            : stock === null || stock === undefined
                ? true
                : JSON.stringify(ancien) !== JSON.stringify(stock);
        if (changé) {
            window.sessionStorage[this._nom] = stock ? JSON.stringify(stock) : undefined;
            //            console.log(this.nom, stock);
            if (this._avecDate) {
                window.sessionStorage[this.nomDate] = Date.now();
            }
            if (this._quandStockChange) {
                this._quandStockChange(ancien, stock);
            }
        }
    }

    public initialise(): void {
        this.fixeStock(undefined);
    }

}

@Injectable({
    providedIn: 'root'
})
export class StockageService {
    private _stockages: IStockage[];
    private _subjectRafraichit: Subject<boolean>;
    private rafraichitObs: Observable<boolean>;
    private _subscriptions: Subscription[];

    private _déclencheursDeRéinitialisation: {
        nom: string,
        dépendants: IStockage[]
    }[];

    constructor() {
        this._stockages = [];
        this._subjectRafraichit = new Subject<boolean>();
        this.rafraichitObs = this._subjectRafraichit.asObservable();
        this._subscriptions = [];
        this._déclencheursDeRéinitialisation = [];
    }

    nouveau<T>(nom: string, options: StockageOptions<T>): Stockage<T> {
        if (nom === undefined || nom === null || nom === '') {
            throw new Error('Un stockage doit avoir un nom.');
        }
        if (this._stockages.find(s => s.nom === nom) !== undefined) {
            throw new Error('Il y a déjà un stockage avec ce nom:' + nom);
        }
        const stockage = new CStockage<T>(nom, options);
        if (options.rafraichit === 'déclenche') {
            if (!options.doitRéinitialiser) {
                throw new Error(`Un stockage de type 'déclenche' doit avoir un 'doitRéinitialiser'.`);
            }
            this._déclencheursDeRéinitialisation.push({
                nom: nom,
                dépendants: []
            });
            this._subscriptions.push(options.doitRéinitialiser.subscribe(
                () => {
                    const déclencheur = this._déclencheursDeRéinitialisation.find(d => d.nom === nom);
                    déclencheur.dépendants.forEach(s => s.initialise());
                }
            ));
        } else {
            if (options.rafraichit === 'rafraichi') {
                if (options.dépendDe) {
                    options.dépendDe.forEach(nomDéclencheur => {
                        const déclencheur = this._déclencheursDeRéinitialisation.find(d => d.nom === nomDéclencheur);
                        if (déclencheur === undefined) {
                            throw new Error(`Il n'y a pas de déclencheur de ce nom: ${nomDéclencheur}`);
                        }
                        déclencheur.dépendants.push(stockage);
                    });
                } else {
                    // sans dépendDe, le stockage dépend de tous les déclencheurs
                    this._déclencheursDeRéinitialisation.forEach(d => d.dépendants.push(stockage));
                }
            }
        }
        this._stockages.push(stockage);
        return stockage;
    }
}
