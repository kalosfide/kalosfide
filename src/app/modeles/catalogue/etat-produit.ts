import { Produit } from './produit';

export enum IdEtatProduit {
    disponible = 'D',
    indisponible = 'I',
    supprimé = 'S',
}

export class EtatProduit {
    valeur: IdEtatProduit;
    texte: string;
    vérifie: (p: Produit) => boolean;
}

export class EtatsProduits {
    static disponible: EtatProduit = {
        valeur: IdEtatProduit.disponible,
        texte: 'disponible',
        vérifie: (p: Produit) => p.etat === IdEtatProduit.disponible
    };
    static indisponible: EtatProduit = {
        valeur: IdEtatProduit.indisponible,
        texte: 'indisponible',
        vérifie: (p: Produit) => p.etat === IdEtatProduit.indisponible
    };
    static supprimé: EtatProduit = {
        valeur: IdEtatProduit.supprimé,
        texte: 'supprimé',
        vérifie: (p: Produit) => p.etat === IdEtatProduit.supprimé
    };
    static états: EtatProduit[] = [EtatsProduits.disponible, EtatsProduits.indisponible, EtatsProduits.supprimé];
    static état(id: string): EtatProduit {
        return EtatsProduits.états.find(e => e.valeur === id);
    }
}
