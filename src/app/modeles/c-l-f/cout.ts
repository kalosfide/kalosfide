import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { TypeMesure } from '../type-mesure';
import { CLFLigne } from './c-l-f-ligne';
import { estNombre } from 'src/app/commun/outils/est-nombre';

export interface ICoût {
    valeur: number;
    complet: boolean;
}

export class CoûtDef<T> {
    iCoût: (t: T) => ICoût;
    valide: (t: T) => boolean;

    constructor(iCoût: (t: T) => ICoût, valide?: (t: T) => boolean) {
        this.iCoût = iCoût;
        this.valide = valide;
    }

    /**
     * Retourne le texte du coût de l'objet, si l'objet est valide, précédé de > si incomplet, suivi de €.
     * @param t objet ayant un coût
     */
    texte(t: T): string {
        return !this.valide || this.valide(t) ? Fabrique.texte.prix(this.iCoût(t)) : '';
    }

    /**
     * Retourne un objet contenant la valeur du total des coûts des objets et un champ incomplet
     * si certains des objets ont un coût incomplet.
     * @param ts objets ayant un coût
     */
    agrége(ts: T[]): ICoût {
        const agrégé: ICoût = { valeur: 0, complet: true };
        let validés = ts;
        if (this.valide) {
            validés = ts.filter(t => this.valide(t));
            if (validés.length < ts.length) {
                agrégé.complet = false;
            }
        }
        validés.forEach( t => {
            const iCoût = this.iCoût(t);
            agrégé.valeur += iCoût.valeur;
            if (!iCoût.complet) {
                agrégé.complet = false;
            }
        });
        return agrégé;
    }

    /**
     * Retourne le texte du total des coûts des objets, précédé de > si incomplet, suivi de €.
     * @param items objets ayant un coût
     */
    texteAgrégé(items: T[]): string {
        return Fabrique.texte.prix(this.agrége(items));
    }
}

export class LigneDocumentCoût {
    private static _coûtDef(date: Date,
                            àAgréger: (ligne: CLFLigne) => number,
                            agrégable?: (ligne: CLFLigne) => boolean
        ): CoûtDef<CLFLigne> {
        return new CoûtDef(
            (ligne: CLFLigne) => {
                const prix = ligne.produit.prix;
                return { valeur: prix * àAgréger(ligne), complet: true };
            },
            (ligne: CLFLigne) => {
                if (agrégable && !agrégable(ligne)) {
                    return false;
                }
                return estNombre(àAgréger(ligne));
            }
        );
    }

    static quantité(date?: Date): CoûtDef<CLFLigne> {
        return LigneDocumentCoût._coûtDef(date,
            (ligne: CLFLigne) => ligne.quantité,
            (ligne: CLFLigne) => ligne.typeCommande === TypeMesure.typeCommandeParDéfaut(ligne.produit.typeMesure)
        );
    }

    static aFixer(date?: Date): CoûtDef<CLFLigne> {
        return LigneDocumentCoût._coûtDef(date,
            (ligne: CLFLigne) => ligne.aFixer,
            (ligne: CLFLigne) => ligne.AFixerEstFixé,
        );
    }

}
