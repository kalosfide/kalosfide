import { Catalogue } from './catalogue';
import { IdEtatProduit } from './etat-produit';

export class CatalogueBilan {
    catégories: number;
    catégoriesVides: number;
    produits: number;
    produitsDisponibles: number;
    constructor(catalogue: Catalogue) {
        this.catégories = catalogue.catégories.length;
        this.catégoriesVides = catalogue.catégories
            .filter(c => catalogue.produits.find(p => p.categorieNo === c.no) !== undefined).length;
        this.produits = catalogue.produits.length;
        this.produitsDisponibles = catalogue.produits
            .filter(p => p.etat === null || p.etat === undefined || p.etat === IdEtatProduit.disponible).length;
    }
}
