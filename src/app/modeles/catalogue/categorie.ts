import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { Produit } from './produit';
import { ProduitBilan } from './produit-bilan';

export class Categorie extends KeyId {
    nom: string;
    date?: Date
    nbProduits: number;
    bilans: ProduitBilan[];

    copieData(d: Categorie) {
        this.nom = d.nom;
    }

    compteProduits(produits: Produit[]) {
        this.nbProduits = produits.filter(p => p.categorieId === this.id).length;
    }

    créeBilans(produits: Produit[]) {
        this.bilans = [{ type: 'C', nb: 0, quantité: 0 }, { type: 'L', nb: 0, quantité: 0 }, { type: 'F', nb: 0, quantité: 0 }];
        this.nbProduits = 0;
        produits.forEach(p => {
            if (p.categorieId === this.id && p.bilans) {
                for (let i = 0; i < 3; i++) {
                    const b = this.bilans[i];
                    const bp = p.bilans[i];
                    b.nb += bp.nb;
                    b.quantité += bp.quantité;
                }
                this.nbProduits++;
            }
        });
    }

    get utilisé(): boolean {
        if (this.bilans) {
            let utilisé = false;
            for (const bilan of this.bilans) {
                utilisé = bilan.nb > 0;
                if (utilisé) {
                    break;
                }
            }
            return utilisé;
        }
    }
}
