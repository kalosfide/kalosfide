import { KfListeDeroulanteBase, IKfListeDeroulante } from './kf-liste-deroulante-base';
import { KfOptionTexte } from './kf-option-texte';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfListeDeroulanteType } from './kf-liste-deroulante-type';
import { IKfOption } from './kf-option-base';

export class KfListeDeroulanteTexteBase extends KfListeDeroulanteBase implements IKfListeDeroulante {

    constructor(nom: string, texte?: KfTexteDef) {
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

    constructor(nom: string, texte?: KfTexteDef) {
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
        if (valeur) {
            return '' + valeur;
        }
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

}

export class KfListeDeroulanteNombre extends KfListeDeroulanteTexteBase implements IKfListeDeroulante {

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
    }

    créeEtAjouteOption(texte: string, valeur: number): KfOptionTexte {
        const option = new KfOptionTexte(valeur.toString());
        option.fixeTexte(texte);
        this._ajouteOption(option);
        return option;
    }

    get valeur(): number {
        const valeur = this.gereValeur.valeur;
        if (valeur) {
            return parseInt(valeur as string, 10);
        }
    }
    set valeur(valeur: number) {
        this.fixeValeur(valeur);
    }

}
