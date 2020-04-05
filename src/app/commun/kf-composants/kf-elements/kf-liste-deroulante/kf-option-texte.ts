import { KfOptionBase } from './kf-option-base';

export class KfOptionTexte extends KfOptionBase {
    private _valeur: string;

    constructor(valeur: string) {
        super();
        this._valeur = valeur;
    }

    get valeur(): string {
        return this._valeur;
    }
}
