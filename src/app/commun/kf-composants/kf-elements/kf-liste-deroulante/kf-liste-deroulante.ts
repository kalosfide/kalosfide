import { KfTypeDeComposant } from '../../kf-composants-types';
import { Liste, TypeDEvenementDeListe, EvenementDeListe, DétailAjoute, DétailSupprime, DétailDéplace } from '../../../outils/liste';
import { KfEntrée } from '../../kf-composant/kf-entree';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfTexte } from '../kf-texte/kf-texte';

export class KfOptionDeListe extends KfContenuPhrase {
    kfTexte: KfTexte;
    private valeurDef: KfTexteDef | number;
    estObject: boolean;
    inactif?: boolean;

    constructor(texteDef?: KfTexteDef, valeurDef?: KfTexteDef | number) {
        super();
        if (texteDef) {
            this.kfTexte = new KfTexte('', texteDef);
            this.ajoute(this.kfTexte);
        }
        this.valeurDef = valeurDef;
    }

    get valeur(): string {
        if (this.valeurDef) {
            if (typeof (this.valeurDef) === 'number') {
                return '' + this.valeurDef;
            } else {
                return ValeurTexteDef(this.valeurDef);
            }
        }
    }
}

export interface IKfListeLiante {
    liste: Liste;
    créeTexte: (item: any) => KfTexteDef;
    créeValeur: (item: any) => string;
}

export class KfListeDeroulanteVieux extends KfEntrée {
    // liste d'objets any
    // données
    private liste: Liste;

    /** pour afficher l'item */
    private créeTexte: (item: any) => KfTexteDef;
    /** pour la valeur HTML de l'item */
    private créeValeur: (item: any) => string | number;

    private pOptions: KfOptionDeListe[];
    multiple: boolean;

    nullImpossible: boolean;

    private pOption0: KfOptionDeListe;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, KfTypeDeComposant.listederoulante);
        this.pOptions = [];
        this.contenuPhrase = new KfContenuPhrase(this, texte);

        this.ajouteClasseDef(
            'form-control',
            { nom: 'position-static', active: () => !this.contenuPhrase }
        );
        const estDansVueTable = () => this.estDansVueTable;
        this.géreClasseLabel.ajouteClasseDef(
            { nom: 'kf-invisible', active: estDansVueTable }
        );
    }

    ajouteOption(texte: KfTexteDef, valeur?: KfTexteDef | number): KfOptionDeListe {
        const option = new KfOptionDeListe(texte, valeur);
        this.pOptions.push(option);
        return option;
    }

    optionNulle(): KfOptionDeListe {
        return null;
    }

    créeOption0(): KfContenuPhrase {
        this.pOption0 = new KfOptionDeListe();
        this.valeur = '';
        return this.pOption0;
    }

    get option0(): KfOptionDeListe {
        return this.pOption0;
    }

    get options(): KfOptionDeListe[] {
        return this.pOptions;
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

    // DONNEES

    /**
     * valeur: any
     */
    get valeur(): any {
        return this.litValeur();
    }
    set valeur(valeur: any) {
        this.fixeValeur(valeur);
    }

    // LISTE LIEE

    lieAListe(liste: Liste, creeTexte?: (item: any) => string, creeValeur?: (item: any) => string | number) {
        this.liste = liste;

        this.liste.Abonne(this, TypeDEvenementDeListe.ajoute,
            (e: EvenementDeListe) => {
                const d = e.data as DétailAjoute;
                this._quandAjout(d.Objet, d.Index);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.supprime,
            (e: EvenementDeListe) => {
                const d = e.data as DétailSupprime;
                this._quandSupprime(d.objet, d.Index);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.deplace,
            (e: EvenementDeListe) => {
                const d = e.data as DétailDéplace;
                this._quandDeplace(d.IndexAvant, d.IndexAprès);
            }
        );
        this.liste.Abonne(this, TypeDEvenementDeListe.vide, () => this._quandVide());
        this.liste.Abonne(this, TypeDEvenementDeListe.remplit, () => this._quandRemplit());

        this.créeTexte = creeTexte;
        this.créeValeur = creeValeur;
    }

    private _créeOption(item: any): KfOptionDeListe {
        const option = new KfOptionDeListe(
            this.créeTexte ? this.créeTexte(item) : 'option ' + (this.liste.IndexDe(item) + 1),
            this.créeValeur ? this.créeValeur(item) : '');
        return option;
    }

    private _quandAjout(objet: any, index: number) {
        this.options.splice(index, 0, this._créeOption(objet));
    }

    private _quandSupprime(objet: any, index: number) {
        const valeur = this.créeValeur ? this.créeValeur(objet) : objet;
        if (this.formControl && this.formControl.value === valeur) {
            this.formControl.setValue(null);
        }
        this.pOptions.splice(index, 1);
    }

    private _quandDeplace(indexAvant: number, indexApres: number) {
        const option = this.pOptions.splice(indexAvant, 1)[0];
        this.pOptions.splice(indexApres, 0, option);
    }

    private _quandRemplit() {
        this.pOptions = this.liste.Objets.map(o => this._créeOption(o));
    }

    private _quandVide() {
        this.pOptions = [];
    }

}
