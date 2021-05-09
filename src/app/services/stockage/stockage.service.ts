import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockageOptions } from './stockage-options';
import { Stockage } from './stockage';

/**
 * Interface permettant au StockageService de gérer les dépendances entre stockages sans tenir compte du type
 * de l'objet stocké.
 */
interface IStockage {
    /**
     * Nom du stockage unique dans l'application
     */
    nom: string;

    /**
     * Supprime l'objet stocké
     */
    vide(): void;
}

/**
 * Objet permettant à un service de stocker des données dans la mémoire du navigateur sans être obligé de les recharger à chaque utilisation
 */
class CStockage<T> implements IStockage, Stockage<T> {
    private pNom: string;
    private quandStockChange: (ancien: T, nouveau: T) => void;

    constructor(nom: string, options?: StockageOptions<T>) {
        this.pNom = nom;
        if (options) {
            this.quandStockChange = options.quandStockChange;
        }
    }

    /**
     * Retourne le nom du stockage.
     */
    public get nom(): string {
        return this.pNom;
    }

    /**
     * Retourne vrai s'il n'y a pas d'objet stocké dans la mémoire du navigateur.
     */
    private estNull(t: string): boolean {
        return t === undefined ||
            t === null ||
            t === 'null' ||
            t === 'undefined' ||
            t === '';
    }

    /**
     * Retourne vrai s'il n'y a pas d'objet stocké dans la mémoire du navigateur.
     */
    public estVide(): boolean {
        return this.estNull(window.sessionStorage[this.pNom]);
    }

    /**
     * Retourne l'objet stocké dans la mémoire du navigateur s'il y en a un, null sinon.
     */
    public litStock(): T {
        const texteStocké = window.sessionStorage[this.pNom];
        return this.estNull(texteStocké) ? null : JSON.parse(texteStocké) as T;
    }

    /**
     * Si l'objet à stocker est différent de l'objet stocké, sauve l'objet à stocker dans la mémoire du navigateur
     * et appelle quandStockChange.
     * @param stock objet à stocker
     */
    public fixeStock(stock: T): void {
        const ancien = this.litStock();
        const changé = ancien === null
            ? stock !== null && stock !== undefined
            : stock === null || stock === undefined
                ? true
                : JSON.stringify(ancien) !== JSON.stringify(stock);
        if (changé) {
            // Sauve l'objet à stocker dans la mémoire du navigateur sous le nom du stockage
            window.sessionStorage[this.pNom] = stock ? JSON.stringify(stock) : undefined;
            //            console.log(this.nom, stock);
            if (this.quandStockChange) {
                this.quandStockChange(ancien, stock);
            }
        }
    }

    /**
     * Vide le stock
     */
    public vide(): void {
        this.fixeStock(undefined);
    }

}

@Injectable({
    providedIn: 'root'
})
export class StockageService {
    private stockages: IStockage[];
    private subscriptions: Subscription[];

    private dépendances: {
        nom: string,
        dépendants: IStockage[]
    }[];

    constructor() {
        this.stockages = [];
        this.subscriptions = [];
        this.dépendances = [];
    }

    /**
     * Retourne un stockage
     * @param nom nom du stockage unique dans l'application
     * @param options définit le comportement du stockage et ses relations avec les autres stockage
     */
    public nouveau<T>(nom: string, options?: StockageOptions<T>): Stockage<T> {
        if (nom === undefined || nom === null || nom === '') {
            throw new Error('Un stockage doit avoir un nom.');
        }
        if (this.stockages.find(s => s.nom === nom) !== undefined) {
            throw new Error('Il y a déjà un stockage avec ce nom: ' + nom);
        }
        const stockage = new CStockage<T>(nom, options);
        this.stockages.push(stockage);
        if (!options) {
            return stockage;
        }
        if (options.déclencheVidage) {
            if (options.rafraichi) {
                throw new Error(`Un stockage avec un 'déclencheVidage' ne peut pas être rafraichi.`);
            }
            this.dépendances.push({
                nom,
                dépendants: []
            });
            this.subscriptions.push(options.déclencheVidage.subscribe(
                () => {
                    const déclencheur = this.dépendances.find(d => d.nom === nom);
                    déclencheur.dépendants.forEach(s => s.vide());
                }
            ));
        }
        if (options.rafraichi) {
            if (options.dépendDe) {
                options.dépendDe.forEach(nomDéclencheur => {
                    const déclencheur = this.dépendances.find(d => d.nom === nomDéclencheur);
                    if (déclencheur === undefined) {
                        throw new Error(`Il n'y a pas de déclencheur de ce nom: ${nomDéclencheur}`);
                    }
                    déclencheur.dépendants.push(stockage);
                });
            } else {
                // sans dépendDe, le stockage dépend de tous les déclencheurs
                this.dépendances.forEach(d => d.dépendants.push(stockage));
            }
        }
        return stockage;
    }
}
