import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfStringDef, ValeurStringDef } from '../../kf-partages/kf-string-def';

export class KfTexte extends KfComposant {
    private stringDef: KfStringDef;

    morceaux: { classe?: string; texte: string }[];

    /**
     * balises Html à ajouter dans le template autour de la partie rendant le composant
     * doivent être fixées avant d'ajouter le composant à son parent
     */
    pBalisesAAjouter: KfTypeDeBaliseHTML[];

    constructor(nom: string, stringDef: KfStringDef) {
        super(nom, KfTypeDeComposant.texte);
        this.stringDef = stringDef;
    }

    get texte(): string {
        if (this.stringDef !== undefined) {
            return ValeurStringDef(this.stringDef);
        }
    }
    fixeTexte(texte: KfStringDef) {
        this.stringDef = texte;
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

    éclairage(àEclairer: string, classeEclairé: string): boolean {
        if (àEclairer === null || àEclairer === undefined || àEclairer === '') {
            this.morceaux = undefined;
            return true;
        }
        àEclairer = àEclairer.toLowerCase();
        const longueur = àEclairer.length;
        let texte = this.texte;
        const morceaux: { classe?: string; texte: string}[] = [];
        while (texte.length > 0) {
            const débutEclairé = texte.toLowerCase().indexOf(àEclairer);
            if (débutEclairé === -1) {
                morceaux.push({ texte });
                texte = '';
            } else {
                morceaux.push({ texte: texte.slice(0, débutEclairé) }, { classe: classeEclairé, texte: texte.substr(débutEclairé, longueur) });
                texte = texte.slice(débutEclairé + longueur);
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
