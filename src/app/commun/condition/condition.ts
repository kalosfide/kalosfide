import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';

export class Conditions<T extends string | number> {
    private _valeurs: T[];
    private _condition: KfInitialObservable<boolean>[];

    nom: string;

    observé: KfInitialObservable<T>;

    /**
     * index de la valeur actuelle
     */
    private _index: number;

    constructor() {
        this._valeurs = [];
        this._condition = [];
    }

    /**
     * A partir d'un initialObservable émettant des valeurs prises dans une liste fixe, pour chaque valeur de cette liste
     * ajoute à la liste des conditions un initialObservable qui émet true quand l'observé émet cette valeur et false quand l'observé émet une autre valeur
     * @param valeurs liste de valeurs
     * @param observéIO initialObservable émettant des valeurs prises dans cette liste
     */
    observe(valeurs: T[], observéIO: KfInitialObservable<T>) {
        this._valeurs = valeurs;
        const nom = this.nom ? this.nom + ' ' : '';
        valeurs.forEach(v => {
            const o = KfInitialObservable.nouveau(v === observéIO.valeur);
            o.nom = nom + `cond_${v.toString()}`;
            this._condition.push(o);
        });
        this._index = this._valeurs.findIndex(v => v === observéIO.valeur);

        observéIO.observable.subscribe(observé => {
            const index = this._valeurs.findIndex(v => v === observé);

            // l'observable ne devrait pas réémettre la même valeur
            if (index === this._index) { return; }

            // il faut émettre la fin de la valeur actuelle
            if (this._index !== -1) {
                this._condition[this._index].changeValeur(false);
            }

            // émission de la nouvelle valeur
            this._index = index;
            if (this._index !== -1) {
                this._condition[index].changeValeur(true);
            }
        });
    }

    /**
     * A partir d'un initialObservable émettant des valeurs prises dans une liste fixe, pour chaque valeur de cette liste
     * ajoute à la liste des conditions un initialObservable qui émet true quand l'observé émet cette valeur et false quand l'observé émet une autre valeur
     * @param TObjet type d'objet ayant une propriété prenant ses valeurs dans une liste fixe
     * @param valeurs liste des valeurs de la propriété
     * @param transforme fonction retournant la valeur de la propriété de l'objet
     * @param observéIO initialObservable émettant des valeurs de type TObjet
     */
    observeObjet<TObjet>(valeurs: T[], transforme: (objet: TObjet) => T, observéIO: KfInitialObservable<TObjet>) {
        this._valeurs = valeurs;
        const nom = this.nom ? this.nom + ' ' : '';
        valeurs.forEach(v => {
            const o = KfInitialObservable.nouveau(v === transforme(observéIO.valeur));
            o.nom = nom + `cond_${v.toString()}`;
            this._condition.push(o);
        });
        this._index = this._valeurs.findIndex(v => v === transforme(observéIO.valeur));

        observéIO.observable.subscribe(observé => {
            const index = this._valeurs.findIndex(v => v === transforme(observé));

            // l'observable ne devrait pas réémettre la même valeur
            if (index === this._index) { return; }

            // il faut émettre la fin de la valeur actuelle
            if (this._index !== -1) {
                this._condition[this._index].changeValeur(false);
            }

            // émission de la nouvelle valeur
            this._index = index;
            if (this._index !== -1) {
                this._condition[index].changeValeur(true);
            }
        });
    }

    index(valeur: T): number {
        return this._valeurs.findIndex(v => v === valeur);
    }

    protected conditionIO(valeur: T): KfInitialObservable<boolean> {
        return this._condition[this.index(valeur)];
    }

    log() {
        const conditions: { [key: string]: boolean } = {};
        for (let i = 0; i < this._condition.length; i++) {
            conditions[this._valeurs[i].toString()] = this._condition[i].valeur;
        }
        console.log(conditions);
    }
}
