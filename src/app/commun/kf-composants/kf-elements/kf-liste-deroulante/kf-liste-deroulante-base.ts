import { KfListeDeroulanteType } from './kf-liste-deroulante-type';
import { KfEntrée } from '../kf-entree/kf-entree';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfOptionBase, IKfOption } from './kf-option-base';
import { KfOptionNulle } from './kf-option-nulle';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfNgClasse, KfNgClasseDef } from '../../kf-partages/kf-gere-css-classe';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';

export interface IKfListeDeroulante {
    typeListe: KfListeDeroulanteType;
    options: IKfOption[];
    option0: IKfOption;
    ajouteOption(option: IKfOption): void;
    compareOptions(option1: IKfOption, option2: IKfOption): boolean;
}

export abstract class KfListeDeroulanteBase extends KfEntrée {
    private pComposantAvant: KfComposant;
    private pGéreClasseComposantAvant: KfGéreCss;

    private pTypeListe: KfListeDeroulanteType;

    private pOptions: KfOptionBase[];

    private pOption0: KfOptionNulle;

    constructor(nom: string, type: KfListeDeroulanteType, texteLabel?: KfTexteDef) {
        super(nom, KfTypeDeComposant.listederoulante, texteLabel);
        // position par défaut
        this.positionLabel = 'avant';
        this.pTypeListe = type;
        this.pOptions = [];
    }

    public get typeListe(): KfListeDeroulanteType { return this.pTypeListe; }
    public get options(): KfOptionBase[] { return this.pOptions; }

    public get valeurObjet(): boolean {
        return this.pTypeListe === KfListeDeroulanteType.valeurObjet;
    }

    public get sansValeur(): boolean {
        return this.pTypeListe === KfListeDeroulanteType.sansValeur;
    }

    /**
     * Ajoute à la liste une option sans valeur.
     */
    créeOption0(): KfOptionNulle {
        this.pOption0 = new KfOptionNulle();
        return this.pOption0;
    }

    abstract ajouteOption(option: IKfOption): void;
    abstract compareOptions(option1: IKfOption, option2: IKfOption): boolean;

    protected _ajouteOption(option: KfOptionBase) {
        this.pOptions.push(option);
    }

    get option0(): KfOptionBase {
        return this.pOption0;
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

    get composantAvant(): KfComposant {
        return this.pComposantAvant;
    }
    get classeComposantAvant(): KfNgClasse {
        if (this.pGéreClasseComposantAvant) {
            return this.pGéreClasseComposantAvant.classe;
        }
    }
    fixeComposantAvant(composant: KfComposant, ...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        this.pComposantAvant = composant;
        if (classeDefs.length > 0) {
            this.pGéreClasseComposantAvant = new KfGéreCss();
            this.pGéreClasseComposantAvant.ajouteClasse(...classeDefs);
        }
    }

}
