import { Produit } from './produit';

export enum IdEtatProduit {
    disponible = 'D',
    indisponible = 'I',
    supprimé = 'S',
}

export const IdsEtatsProduits: string[] = [
    IdEtatProduit.disponible,
    IdEtatProduit.indisponible,
    IdEtatProduit.supprimé,
];

export class EtatProduit {
    valeur: IdEtatProduit;
    texte: string;
    vérifie: (p: Produit) => boolean;
}

const disponible: EtatProduit = {
    valeur: IdEtatProduit.disponible,
    texte: 'disponible',
    vérifie: (p: Produit) => p.etat === IdEtatProduit.disponible
};
const indisponible: EtatProduit = {
    valeur: IdEtatProduit.indisponible,
    texte: 'indisponible',
    vérifie: (p: Produit) => p.etat === IdEtatProduit.indisponible
};
const supprimé: EtatProduit = {
    valeur: IdEtatProduit.supprimé,
    texte: 'supprimé',
    vérifie: (p: Produit) => p.etat === IdEtatProduit.supprimé
};
class CEtatsProduits {
    disponible = disponible;
    indisponible = indisponible;
    supprimé = supprimé;
    etats: EtatProduit[] = [disponible, indisponible, supprimé];
    etat(id: string): EtatProduit {
        return this.etats.find(e => e.valeur === id);
    }
}
export const EtatsProduits = new CEtatsProduits();
