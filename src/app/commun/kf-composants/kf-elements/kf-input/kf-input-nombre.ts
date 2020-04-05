import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput, KfTypeDInput } from './kf-input';

export class KfInputNombre extends KfInput {
    typeDInput: KfTypeDInput;
    min: number;
    max: number;
    pas: number;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.nombre;
    }

    get valeur(): number {
        const v = this.litValeur();
        let valeur: number;
        if (typeof (v) === 'number') {
            valeur = v;
        }
        if (typeof (v) === 'string') {
            valeur = Number.parseFloat(v);
        }
        if (!Number.isNaN(valeur)) {
            return valeur;
        }
    }
    set valeur(valeur: number) {
        this.fixeValeur(valeur);
    }

}
