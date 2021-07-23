import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfInput } from './kf-input';
import { KfTypeDInput } from './kf-type-d-input';
import { Dateur } from 'src/app/commun/outils/dateur';

export class KfInputDate extends KfInput {
    typeDInput: KfTypeDInput;

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.date;
    }

    get valeur(): string {
        return this.litValeur() as string;
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

    get date(): Date {
        const valeur: any = this.litValeur();
        return valeur ? new Date(valeur) : null;
    }
    set date(date: Date) {
        this.fixeValeur(Dateur.InputDateValue(date));
    }

}
