import { KfListeDeroulanteType } from './kf-liste-deroulante-type';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfOptionBase, IKfOption } from './kf-option-base';
import { KfOptionNulle } from './kf-option-nulle';
import { KfComposant } from '../../kf-composant/kf-composant';

export interface IKfListeDeroulante {
    typeListe: KfListeDeroulanteType;
    options: IKfOption[];
    option0: IKfOption;
    ajouteOption(option: IKfOption): void;
    compareOptions(option1: IKfOption, option2: IKfOption): boolean;
}

export abstract class KfListeDeroulanteBase extends KfEntrée {
    composantAvant: KfComposant;
    private _typeListe: KfListeDeroulanteType;

    private _options: KfOptionBase[];

    private _option0: KfOptionNulle;

    constructor(nom: string, type: KfListeDeroulanteType, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.listederoulante);
        this._typeListe = type;
        this._options = [];
        this.contenuPhrase = new KfContenuPhrase(this, texte);

        this.ajouteClasseDef(
            'form-control',
            { nom: 'position-static', active: () => !this.contenuPhrase },
            { nom: 'is-invalid', active: () => this.erreurs.length > 0 },
        );
    }

    public get typeListe(): KfListeDeroulanteType { return this._typeListe; }
    public get options(): KfOptionBase[] { return this._options; }

    public get valeurObjet(): boolean {
        return this._typeListe === KfListeDeroulanteType.valeurObjet;
    }

    public get sansValeur(): boolean {
        return this._typeListe === KfListeDeroulanteType.sansValeur;
    }

    créeOption0(): KfOptionNulle {
        this._option0 = new KfOptionNulle();
        return this._option0;
    }

    abstract ajouteOption(option: IKfOption): void;
    abstract compareOptions(option1: IKfOption, option2: IKfOption): boolean;

    protected _ajouteOption(option: KfOptionBase) {
        this._options.push(option);
    }

    get option0(): KfOptionBase {
        return this._option0;
    }

    get selectElement(): HTMLSelectElement {
        return this.gereHtml.htmlElement as HTMLSelectElement;
    }

    litIndex(): number {
        return this.selectElement ? this.selectElement.selectedIndex : -1;
    }
    fixeIndex(index: number) {
        console.log('fixeIndex');
        if (this.selectElement && this.selectElement.selectedIndex !== index) {
            console.log('Indexfixé');
            this.selectElement.selectedIndex = index;
        }
    }

    get valeur(): any {
        return this.litValeur();
    }
    set valeur(valeur: any) {
        this.fixeValeur(valeur);
    }

}
