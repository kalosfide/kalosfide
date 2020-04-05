import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';

export class Conditions<T extends string | number> {
    private _valeurs: T[];
    private _condition: KfInitialObservable<boolean>[];
    private _pas_condition: KfInitialObservable<boolean>[];

    nom: string;

    /**
     * index de la valeur actuelle
     */
    private _index: number;

    constructor() {
        this._valeurs = [];
        this._condition = [];
        this._pas_condition = [];
    }

    ajoute(valeur: T, condition: KfInitialObservable<boolean>) {
        this._valeurs.push(valeur);
        this._condition.push(condition);
        this._pas_condition.push(KfInitialObservable.non(condition));
    }

    /**
     * transforme des observables de boolean permettant
     * @param valeurs valeurs d'une Enum
     * @param observéIO initialObservable de cette Enum
     */
    observe(valeurs: T[], observéIO: KfInitialObservable<T>) {
        this._valeurs = valeurs;
        const nom = this.nom ? this.nom + ' ' : '';
        valeurs.forEach(v => {
            let o = KfInitialObservable.nouveau(v === observéIO.valeur);
            o.nom = nom + `cond_${v.toString()}`;
            this._condition.push(o);
            o = KfInitialObservable.nouveau(v !== observéIO.valeur);
            o.nom = nom + `pas_cond_${v.toString()}`;
            this._pas_condition.push(o);
        });
        this._index = this._valeurs.findIndex(v => v === observéIO.valeur);

        observéIO.observable.subscribe(observé => {
            const index = this._valeurs.findIndex(v => v === observé);

            // l'observable ne devrait pas réémettre la même valeur
            if (index === this._index) { return; }

            // il faut émettre la fin de la valeur actuelle
            if (this._index !== -1) {
                this._condition[this._index].changeValeur(false);
                this._pas_condition[this._index].changeValeur(true);
            }

            // émission de la nouvelle valeur
            this._index = index;
            if (this._index !== -1) {
                this._condition[index].changeValeur(true);
                this._pas_condition[index].changeValeur(false);
            }
        });
    }

    index(valeur: T): number {
        return this._valeurs.findIndex(v => v === valeur);
    }

    protected conditionIO(valeur: T): KfInitialObservable<boolean> {
        return this._condition[this.index(valeur)];
    }

    protected pas_conditionIO(valeur: T): KfInitialObservable<boolean> {
        return this._pas_condition[this.index(valeur)];
    }

    log() {
        const conditions: { [key: string]: boolean } = {};
        for (let i = 0; i < this._condition.length; i++) {
            conditions[this._valeurs[i].toString()] = this._condition[i].valeur;
            conditions['non_' + this._valeurs[i].toString()] = this._pas_condition[i].valeur;
        }
        console.log(conditions);
    }
}
