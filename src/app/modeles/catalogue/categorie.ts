import { KeyUidRnoNo, IKeyUidRnoNoData } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { Produit } from './produit';
import { ProduitBilan } from './produit-bilan';

export interface ICategorieData extends IKeyUidRnoNoData {
    no: number;
    nom: string;
    date?: Date
}

export class Categorie extends KeyUidRnoNo implements ICategorieData {
    nom: string;
    date?: Date
    nbProduits: number;
    bilans: ProduitBilan[];

    copieData(d: CategorieData) {
        this.nom = d.nom;
    }

    compteProduits(produits: Produit[]) {
        this.nbProduits = produits.filter(p => p.categorieNo === this.no).length;
    }

    créeBilans(produits: Produit[]) {
        this.bilans = [{ type: 'C', nb: 0, quantité: 0 }, { type: 'L', nb: 0, quantité: 0 }, { type: 'F', nb: 0, quantité: 0 }];
        this.nbProduits = 0;
        produits.forEach(p => {
            if (p.categorieNo === this.no && p.bilans) {
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

export class CategorieData implements ICategorieData {
    no: number;
    nom: string;
    date?: Date
}
