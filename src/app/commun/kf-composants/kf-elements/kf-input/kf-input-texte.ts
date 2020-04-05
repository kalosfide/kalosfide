import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfInput, KfTypeDInput } from './kf-input';

export class KfInputTexte extends KfInput {
    typeDInput: KfTypeDInput;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.texte;
    }

    get valeur(): string {
        return this.litValeur() as string;
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

}
