import { ProduitEditeur } from './produit-editeur';
import { ProduitBilan } from './produit-bilan';
import { TypeCLF, apiType } from '../c-l-f/c-l-f-type';
import { KfVueTableLigne } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { TypeMesure } from '../type-mesure';
import { TypeCommande } from '../type-commande';

export interface IAvecProduit {
    produit: Produit;
}

export class Produit extends KeyId implements IAvecProduit {
    nom: string;
    categorieId: number;
    typeCommande: TypeCommande;
    typeMesure: TypeMesure;
    prix: number;
    // présents pour le fournisseur
    disponible: boolean;
    date?: Date;
    bilans: ProduitBilan[];

    // affecté à la création
    nomCategorie?: string;

    editeur?: ProduitEditeur;

    /**
     * Ligne d'une vueTable affichant le produit.
     */
    vueTableLigne?: KfVueTableLigne<Produit>;

    /**
     * Implémentation de l'interface IAvecProduit.
     */
    get produit(): Produit {
        return this;
    }

    /**
     * Ne copie que les valeurs définies
     * @param de data source
     * @param vers data destination
     */
    static copieData(de: Produit, vers: Produit) {
        if (de.nom) { vers.nom = de.nom; }
        if (de.categorieId) { vers.categorieId = de.categorieId; }
        if (de.typeCommande) { vers.typeCommande = de.typeCommande; }
        if (de.typeMesure) { vers.typeMesure = de.typeMesure; }
        if (de.prix) { vers.prix = de.prix; }
        if (de.disponible) { vers.disponible = de.disponible; }
        if (de.date) { vers.date = de.date; }
        if (de.bilans) { vers.bilans = de.bilans; }
    }

    get apiProduitPrix(): Produit {
        const produit = new Produit();
        KeyId.copieKey(this, produit);
        this.prix = this.editeur.kfPrix.valeur;
        produit.prix = this.prix;
        return produit;
    }

    get apiProduitEtat(): Produit {
        const produit = new Produit();
        KeyId.copieKey(this, produit);
        this.disponible = this.editeur.kfDisponible.valeur === true;
        produit.disponible = this.disponible;
        return produit;
    }

    bilan(type: TypeCLF): ProduitBilan {
        if (this.bilans) {
            return this.bilans.find(b => b.type === apiType(type));
        }
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

