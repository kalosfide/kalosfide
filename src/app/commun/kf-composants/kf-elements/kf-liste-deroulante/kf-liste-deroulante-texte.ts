import { KfListeDeroulanteBase, IKfListeDeroulante } from './kf-liste-deroulante-base';
import { KfOptionTexte } from './kf-option-texte';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfListeDeroulanteType } from './kf-liste-deroulante-type';
import { IKfOption } from './kf-option-base';
import { KfTypeDeValeur } from '../../kf-composants-types';

export class KfListeDeroulanteTexteBase extends KfListeDeroulanteBase implements IKfListeDeroulante {

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, KfListeDeroulanteType.valeurTexte, texte);
    }

    ajouteOption(option: KfOptionTexte) {
        this._ajouteOption(option);
        return option;
    }

    compareOptions(option1: IKfOption, option2: IKfOption): boolean {
        return option1.valeur === option2.valeur;
    }

}

export class KfListeDeroulanteTexte extends KfListeDeroulanteTexteBase implements IKfListeDeroulante {

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, texte);
    }

    créeEtAjouteOption(texte: string, valeur: string): KfOptionTexte {
        const option = new KfOptionTexte(valeur);
        option.fixeTexte(texte);
        this._ajouteOption(option);
        return option;
    }

    get valeur(): string {
        const valeur = this.gereValeur.valeur;
        if (valeur !== null && valeur !== undefined) {
            return '' + valeur;
        }
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

}

export class KfListeDeroulanteNombre extends KfListeDeroulanteTexteBase implements IKfListeDeroulante {

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, texte);
        this.gereValeur.typeDeValeur = KfTypeDeValeur.avecEntreeInputNombre;
    }

    créeEtAjouteOption(texte: string, valeur: number): KfOptionTexte {
        const option = new KfOptionTexte(valeur.toString());
        option.fixeTexte(texte);
        this._ajouteOption(option);
        return option;
    }

    get valeur(): number {
        const valeur = this.gereValeur.valeur;
        if (valeur !== null && valeur !== undefined) {
            return parseInt(valeur as string, 10);
        }
    }
    set valeur(valeur: number) {
        this.fixeValeur(valeur);
    }

}
