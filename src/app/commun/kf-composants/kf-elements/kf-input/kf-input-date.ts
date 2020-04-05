import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput, KfTypeDInput } from './kf-input';
import { KfBouton } from '../kf-bouton/kf-bouton';
import { Dateur } from 'src/app/commun/outils/dateur';

export class KfInputDate extends KfInput {
    typeDInput: KfTypeDInput;

    constructor(nom: string, texte?: KfTexteDef) {
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
