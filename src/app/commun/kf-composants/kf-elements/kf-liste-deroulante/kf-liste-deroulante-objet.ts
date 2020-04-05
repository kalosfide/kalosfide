import { KfListeDeroulanteBase, IKfListeDeroulante } from './kf-liste-deroulante-base';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfListeDeroulanteType } from './kf-liste-deroulante-type';
import { KfOptionObjet } from './kf-option-objet';

export class KfListeDeroulanteObjet<T> extends KfListeDeroulanteBase implements IKfListeDeroulante {

    private _compareItems: (t1: T, t2: T) => boolean;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfListeDeroulanteType.valeurObjet, texte);
    }

    set compareItems(compareItems: (t1: T, t2: T) => boolean) {
        this._compareItems = compareItems;
    }

    ajouteOption(option: KfOptionObjet<T>) {
        this._ajouteOption(option);
        return option;
    }

    get valeur(): T {
        return this.gereValeur.valeur;
    }
    set valeur(valeur: T) {
        this.gereValeur.valeur = valeur;
    }

    // Utile pour Angular vérifier si les objets ont été recréés avec les mêmes données
    compareOptions(o1: KfOptionObjet<T>, o2: KfOptionObjet<T>): boolean {
        return o1 && o2
            ? this._compareItems
                ? this._compareItems(o1.valeur, o2.valeur)
                : o1.valeur === o2.valeur
            : o1 === o2;
    }

}
