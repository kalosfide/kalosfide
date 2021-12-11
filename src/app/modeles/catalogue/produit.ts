import { KeyUidRnoNo, IKeyUidRnoNoData } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { ProduitEditeur } from './produit-editeur';
import { ProduitBilan } from './produit-bilan';
import { TypeCLF, apiType } from '../c-l-f/c-l-f-type';
import { KfVueTableLigne } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne';

export interface IAvecProduit {
    produit: Produit;
}

export interface IProduitData extends IKeyUidRnoNoData {
    no: number;
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    etat: string;
    date?: Date;
    bilans: ProduitBilan[];
}

export class Produit extends KeyUidRnoNo implements IAvecProduit, IProduitData {
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    // présents pour le fournisseur
    etat: string;
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
    static copieData(de: IProduitData, vers: IProduitData) {
        if (de.nom) { vers.nom = de.nom; }
        if (de.categorieNo) { vers.categorieNo = de.categorieNo; }
        if (de.typeCommande) { vers.typeCommande = de.typeCommande; }
        if (de.typeMesure) { vers.typeMesure = de.typeMesure; }
        if (de.prix) { vers.prix = de.prix; }
        if (de.etat) { vers.etat = de.etat; }
        if (de.date) { vers.date = de.date; }
        if (de.bilans) { vers.bilans = de.bilans; }
    }

    get apiProduitPrix(): Produit {
        const produit = new Produit();
        KeyUidRnoNo.copieKey(this, produit);
        this.prix = this.editeur.kfPrix.valeur;
        produit.prix = this.prix;
        return produit;
    }

    get apiProduitEtat(): Produit {
        const produit = new Produit();
        KeyUidRnoNo.copieKey(this, produit);
        this.etat = this.editeur.kfEtat.valeur;
        produit.etat = this.etat;
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

export class ProduitData implements IProduitData {
    no: number;
    nom: string;
    categorieNo: number;
    typeCommande: string;
    typeMesure: string;
    prix: number;
    etat: string;
    date?: Date;
    bilans: ProduitBilan[];
}

