import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';

export class KfTexte extends KfComposant {
    private texteDef: KfTexteDef;

    morceaux: { highlight?: boolean; texte: string }[];

    /**
     * balises Html à ajouter dans le template autour de la partie rendant le composant
     * doivent être fixées avant d'ajouter le composant à son parent
     */
    pBalisesAAjouter: KfTypeDeBaliseHTML[];

    constructor(nom: string, texteDef: KfTexteDef) {
        super(nom, KfTypeDeComposant.texte);
        this.texteDef = texteDef;
    }

    get texte(): string {
        if (this.texteDef !== undefined) {
            return ValeurTexteDef(this.texteDef);
        }
    }
    fixeTexte(texte: KfTexteDef) {
        this.texteDef = texte;
    }

    get balisesAAjouter(): KfTypeDeBaliseHTML[] {
        if (!this.pBalisesAAjouter && this.avecClassesOuStyle) {
            return [KfTypeDeBaliseHTML.span];
        }
        return this.pBalisesAAjouter;
    }

    set balisesAAjouter(balisesAAjouter: KfTypeDeBaliseHTML[]) {
        this.pBalisesAAjouter = balisesAAjouter;
    }

    éclairage(àEclairer: string): boolean {
        if (àEclairer === null || àEclairer === undefined || àEclairer === '') {
            this.morceaux = undefined;
            return true;
        }
        let texte = this.texte;
        const morceaux: { highlight?: boolean; texte: string}[] = [];
        while (texte.length > 0) {
            const débutEclairé = texte.toLowerCase().indexOf(àEclairer.toLowerCase());
            if (débutEclairé === -1) {
                morceaux.push({ texte });
                texte = '';
            } else {
                morceaux.push({ texte: texte.slice(0, débutEclairé) }, { highlight: true, texte: àEclairer });
                texte = texte.slice(débutEclairé + àEclairer.length);
            }
        }
        if (morceaux.length > 1) {
            this.morceaux = morceaux;
            return true;
        } else {
            this.morceaux = undefined;
            return false;
        }
    }
}
