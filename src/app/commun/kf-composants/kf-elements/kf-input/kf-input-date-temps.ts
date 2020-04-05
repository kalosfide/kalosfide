import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput, KfTypeDInput } from './kf-input';
import { KfInputDate } from './kf-input-date';
import { KfInputTemps } from './kf-input-temps';
import { Dateur } from 'src/app/commun/outils/dateur';

export class KfInputDateTemps extends KfInput {
    typeDInput: KfTypeDInput;

    inputDate: KfInputDate;
    inputTemps: KfInputTemps;

    private _min: Date;
    private _max: Date;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.datetemps;

        this.inputDate = new KfInputDate('date');
        this.inputDate.estRacineV = true;

        this.inputTemps = new KfInputTemps('time');
        this.inputTemps.estRacineV = true;

    }

    get valeur(): Date {
        const texte: any = this.litValeur();
        return texte ? new Date(texte) : null;
    }
    set valeur(valeur: Date) {
        this.inputDate.date = valeur;
        this.inputTemps.temps = valeur;
        this.fixeValeur(valeur);
    }
    quandValeurChange() {
        this.fixeValeur(Dateur.InputValueToDate(this.inputDate.valeur, this.inputTemps.valeur));
    }

    get min(): Date {
        return this._min;
    }
    set min(valeur: Date) {
        this._min = valeur;
    }

    get minDate(): string {
        if (this._min) {
            return Dateur.InputDateValue(this._min);
        }
    }

    get minTemps(): string {
        if (this._min) {
            return this.inputDate.valeur === this.minDate ? Dateur.InputTimeValue(this._min) : '00:00';
        }
    }

    get max(): Date {
        return this._max;
    }
    set max(valeur: Date) {
        this._max = valeur;
    }

    get maxDate(): string {
        if (this._max) {
            return Dateur.InputDateValue(this._max);
        }
    }

    get maxTemps(): string {
        if (this._max) {
            return this.inputDate.valeur === this.maxDate ? Dateur.InputTimeValue(this._max) : '23:59';
        }
    }
}
