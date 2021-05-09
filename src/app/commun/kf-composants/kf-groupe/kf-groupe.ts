import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { FormGroup } from '@angular/forms';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfDivTable, KfDivTableLigne } from './kf-div-table';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';

export interface IKfComportementFormulaire {
    sauveQuandChange?: boolean;
    traiteReset?: { traitement?: () => void; };
    traiteSubmit?: { traitement: () => void; };
    neSoumetPasSiPristine?: boolean;
}

export class KfGroupe extends KfComposant {

    private pComportementFormulaire: IKfComportementFormulaire;

    /**
     * Doit être fixée avant quandTousAjoutés.
     * n'aura un effet que si le groupe est racine et avec valeur
     */
    get comportementFormulaire(): IKfComportementFormulaire {
        return this.pComportementFormulaire;
    }
    set comportementFormulaire(comportementFormulaire: IKfComportementFormulaire) {
        if (comportementFormulaire.sauveQuandChange && comportementFormulaire.traiteReset) {
            console.warn(`Avec l'option sauveQuandChange, traiteReset est sans effet.`)
        }
        this.pComportementFormulaire = comportementFormulaire;
    }

    /**
     * si formulaire et vrai, ajoute l'affichage des erreurs
     */
    private pAvecInvalidFeedback: boolean;
    get avecInvalidFeedback(): boolean {
        if (this.estRacineV) {
            return this.pAvecInvalidFeedback;
        }
        if (this.parent) {
            return this.parent.avecInvalidFeedback;
        }
    }
    set avecInvalidFeedback(avecInvalidFeedback: boolean) {
        this.pAvecInvalidFeedback = avecInvalidFeedback;
    }

    /**
     * si existe, gére le css d'une div créée autour des contenus
     */
    private géreCssSousDiv: KfGéreCss;

    private masqué: boolean;
    legende: KfEtiquette;

    private pDivTable: KfDivTable;
    private pDivLigne: KfDivTableLigne;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.groupe);
    }

    créeGereValeur() {
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecGroupe);
    }

    get peutSoumettre(): boolean {
        return this.formGroup && (!(this.comportementFormulaire.neSoumetPasSiPristine && this.formGroup.pristine) && this.formGroup.valid);
    }

    /**
     * crée le gestionnaire css d'une div à ajouter autour des contenus
     */
    contenusDansDiv(classe: string) {
        this.géreCssSousDiv = new KfGéreCss();
        this.géreCssSousDiv.ajouteClasse(classe);
    }
    get classeSousDiv(): KfNgClasse {
        if (this.géreCssSousDiv) {
            return this.géreCssSousDiv.classe;
        }
    }

    get divTable(): KfDivTable {
        return this.pDivTable;
    }
    créeDivTable() {
        this.pDivTable = new KfDivTable();
    }

    get divLigne(): KfDivTableLigne {
        return this.pDivLigne;
    }
    créeDivLigne() {
        this.pDivLigne = new KfDivTableLigne();
    }

    masquable(masqueInitial: boolean) {
        this.masqué = masqueInitial;
    }

    get estMasquable(): boolean {
        return this.masqué !== undefined;
    }

    get masque(): boolean {
        return this.masqué === true;
    }

    basculeMasque() {
        this.masqué = !this.masqué;
    }

    get valeur(): any {
        if (this.gereValeur) {
            return this.gereValeur.valeur;
        }
    }
    set valeur(valeur: any) {
        if (this.gereValeur) {
            this.gereValeur.valeur = valeur;
        }
    }

    /**
     * fixe la valeur des contenus à partir des champs de même nom du paramètre
     * @param valeur peut contenir des champs qui ne correspondent pas aux contenus
     */
    fixeValeur(valeur: any) {
        this.contenus.forEach(c => {
            if (c.estEntree) {
                c.gereValeur.valeur = valeur[c.nom];
            }
        });
    }

    get formGroup(): FormGroup {
        return this.abstractControl as FormGroup;
    }

    // FOCUS
    prendLeFocus(): boolean {
        if (this.gereHtml.prendLeFocus()) {
            return true;
        }
        return !!this.contenus.find(c => c.prendLeFocus());
    }

}
