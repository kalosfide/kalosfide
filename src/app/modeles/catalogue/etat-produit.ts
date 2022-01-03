import { KfEntreeInputBool } from 'src/app/commun/kf-composants/kf-composants-types';
import { Produit } from './produit';

export enum IdEtatProduit {
    disponible = 'D',
    indisponible = 'I',
    supprimé = 'S',
}

export class EtatProduit {
    valeur: KfEntreeInputBool;
    texte: string;
    vérifie: (p: Produit) => boolean;
}

export class EtatsProduits {
    static oui: EtatProduit = {
        valeur: KfEntreeInputBool.oui,
        texte: 'Disponible',
        vérifie: (p: Produit) => p.disponible
    };
    static non: EtatProduit = {
        valeur: KfEntreeInputBool.non,
        texte: 'Indisponible',
        vérifie: (p: Produit) => !p.disponible
    };
    static états: EtatProduit[] = [EtatsProduits.oui, EtatsProduits.non];
    static état(disponible: boolean): EtatProduit {
        return disponible ? this.oui : this.non;
    }
}
