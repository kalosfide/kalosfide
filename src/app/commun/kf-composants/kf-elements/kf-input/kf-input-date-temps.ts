import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput } from './kf-input';
import { KfTypeDInput } from './kf-type-d-input';
import { KfInputDate } from './kf-input-date';
import { KfInputTemps } from './kf-input-temps';
import { Dateur } from 'src/app/commun/outils/dateur';

export class KfInputDateTemps extends KfInput {
    typeDInput: KfTypeDInput;

    inputDate: KfInputDate;
    inputTemps: KfInputTemps;

    private pMin: Date;
    private pMax: Date;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.datetemps;

        this.inputDate = new KfInputDate('date');
        this.inputDate.estRacineV = true;

        this.inputTemps = new KfInputTemps('time');
        this.inputTemps.estRacineV = true;

        // crée la div englobante
        const g = this.géreClasseDiv;
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
        return this.pMin;
    }
    set min(valeur: Date) {
        this.pMin = valeur;
    }

    get minDate(): string {
        if (this.pMin) {
            return Dateur.InputDateValue(this.pMin);
        }
    }

    get minTemps(): string {
        if (this.pMin) {
            return this.inputDate.valeur === this.minDate ? Dateur.InputTimeValue(this.pMin) : '00:00';
        }
    }

    get max(): Date {
        return this.pMax;
    }
    set max(valeur: Date) {
        this.pMax = valeur;
    }

    get maxDate(): string {
        if (this.pMax) {
            return Dateur.InputDateValue(this.pMax);
        }
    }

    get maxTemps(): string {
        if (this.pMax) {
            return this.inputDate.valeur === this.maxDate ? Dateur.InputTimeValue(this.pMax) : '23:59';
        }
    }
}
