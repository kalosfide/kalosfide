import { Categorie, CategorieData, ICategorieData } from './categorie';
import { Produit, ProduitData, IProduitData } from './produit';
import { PrixDaté } from './prix-date';

export interface ICatalogue {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    /** date du catalogue, DATE_NULLE si la modification est en cours */
    date?: Date;

    catégories: ICategorieData[];
    produits: IProduitData[];

    prixDatés?: PrixDaté[];
}


export class CatalogueApi implements ICatalogue {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    /** date du catalogue, DATE_NULLE si la modification est en cours */
    date?: Date;

    catégories: CategorieData[];
    produits: ProduitData[];

    prixDatés?: PrixDaté[];
}
export class Catalogue implements ICatalogue {
    /** uid du site */
    uid: string;
    /** rno du site */
    rno: number;

    /** date du catalogue, DATE_NULLE si la modification est en cours */
    date?: Date;


    catégories: Categorie[];
    produits: Produit[];

    /**
     * si présent, le catalogue contient les produits dans leur état actuel
     * si vrai, le catalogue contient tous les produits
     * si faux, le catalogue contient tous les produits disponibles
     */
    avecIndisponibles?: boolean;

    /**
     * Fixé quand des tarifs sont ajoutés au catalogue
     */
    prixDatés?: PrixDaté[];

    /**
     * crée un catalogue à partir d'une lecture de l'Api
     */
    static nouveau(catalogueApi: ICatalogue): Catalogue {
        const catalogue = new Catalogue();
        catalogue.uid = catalogueApi.uid;
        catalogue.rno = catalogueApi.rno;
        catalogue.date = catalogueApi.date;
        catalogue.catégories = catalogueApi.catégories.map(
            (data: CategorieData) => {
                const categorie = new Categorie();
                categorie.uid = catalogueApi.uid;
                categorie.rno = catalogueApi.rno;
                categorie.no = data.no;
                categorie.copieData(data);
                return categorie;
            }
        );
        catalogue.produits = catalogueApi.produits.map(
            (data: ProduitData) => {
                const produit = new Produit();
                produit.uid = catalogueApi.uid;
                produit.rno = catalogueApi.rno;
                produit.no = data.no;
                Produit.copieData(data, produit);
                const categorie = catalogueApi.catégories.find(c => c.no === produit.categorieNo);
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
        filtré.catégories = catalogue.catégories.filter(c => filtré.produits.find(p => p.categorieNo === c.no));
        return filtré;
    }

    static prixDaté(catalogue: Catalogue, no: number, date: Date): number {
        if (catalogue.prixDatés) {
            const prixAvant = catalogue.prixDatés
                .filter(pd => pd.no === no)
                .sort((pd1, pd2) => pd1.date < pd2.date ? -1 : pd1.date === pd2.date ? 0 : 1)
                .filter(pd => pd.date <= date);
            if (prixAvant.length > 0) {
                return prixAvant[prixAvant.length - 1].prix;
            }
        }
        return catalogue.produits.find(p => p.no === no).prix;
    }

    static prixDatés(anciens: CatalogueApi[]): PrixDaté[] {
        let prixAnciens: PrixDaté[] = [];
        anciens.forEach(a => {
            prixAnciens = prixAnciens.concat(a.produits
                .map(p => {
                    const pp = new PrixDaté();
                    pp.no = p.no;
                    pp.date = a.date;
                    pp.prix = p.prix;
                    return pp;
                })
            );
        });
        return prixAnciens;
    }
}
