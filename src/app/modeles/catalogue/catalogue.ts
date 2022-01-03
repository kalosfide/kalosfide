import { Site } from '../site/site';
import { Categorie } from './categorie';
import { Produit } from './produit';

/**
 * Interface implémentée par Catalogue et CatalogueApi
 */
export interface ICatalogue {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    catégories: Categorie[];
    produits: Produit[];
}

/**
 * Catalogue retourné par l'Api
 */
export class CatalogueApi implements ICatalogue {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    catégories: Categorie[];
    produits: Produit[];
}
export class Catalogue implements ICatalogue {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    catégories: Categorie[];
    produits: Produit[];

    /**
     * si présent, le catalogue contient les produits dans leur état actuel
     * si vrai, le catalogue contient tous les produits
     * si faux, le catalogue contient tous les produits disponibles
     */
    avecIndisponibles?: boolean;

    private constructor() { }

    /**
     * Crée un catalogue à partir d'un catalogue ou d'une lecture de l'Api
     * @param icatalogue Catalogue stocké ou CatalogueApi lu
     */
    static nouveau(icatalogue: ICatalogue): Catalogue {
        const catalogue = new Catalogue();
        catalogue.catégories = icatalogue.catégories.map(
            (data: Categorie) => {
                const categorie = new Categorie();
                categorie.id = data.id;
                categorie.copieData(data);
                return categorie;
            }
        );
        catalogue.produits = icatalogue.produits.map(
            (data: Produit) => {
                const produit = new Produit();
                produit.id = data.id;
                Produit.copieData(data, produit);
                const categorie = icatalogue.catégories.find(c => c.id === produit.categorieId);
                produit.nomCategorie = categorie.nom;
                return produit;
            }
        );
        return catalogue;
    }

    /**
     * crée un catalogue ne contenant que les produits du catalogue initial passant le filtre et leurs catégories
     */
    static filtre(catalogue: Catalogue, filtreProduit: (p: Produit) => boolean): Catalogue {
        const filtré = new Catalogue();
        filtré.uid = catalogue.uid;
        filtré.rno = catalogue.rno;
        filtré.produits = catalogue.produits.filter(p => filtreProduit(p));
        filtré.catégories = catalogue.catégories.filter(c => filtré.produits.find(p => p.categorieId === c.id));
        return filtré;
    }
}
