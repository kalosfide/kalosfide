import { KfTypeDeValeur } from '../../kf-composants-types';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput } from './kf-input';
import { KfTypeDInput } from './kf-type-d-input';

export class KfInputNombre extends KfInput {
    typeDInput: KfTypeDInput;
    min: number;
    max: number;
    pas: number;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.nombre;
        this.gereValeur.typeDeValeur = KfTypeDeValeur.avecEntreeInputNombre;
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
