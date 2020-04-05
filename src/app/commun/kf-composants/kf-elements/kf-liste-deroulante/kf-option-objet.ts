import { KfOptionBase } from './kf-option-base';

export class KfOptionObjet<T> extends KfOptionBase {
    private _valeur: T;

    constructor(valeur: T) {
        super();
        this._valeur = valeur;
    }

    get valeur(): T {
        return this._valeur;
    }
}
