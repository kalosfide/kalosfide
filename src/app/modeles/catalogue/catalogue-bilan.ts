import { Catalogue } from './catalogue';

export class CatalogueBilan {
    catégories: number;
    catégoriesVides: number;
    produits: number;
    produitsDisponibles: number;
    constructor(catalogue: Catalogue) {
        this.catégories = catalogue.catégories.length;
        this.catégoriesVides = catalogue.catégories
            .filter(c => catalogue.produits.find(p => p.categorieId === c.id) !== undefined).length;
        this.produits = catalogue.produits.length;
        this.produitsDisponibles = catalogue.produits
            .filter(p => p.disponible === null || p.disponible === undefined || p.disponible === true).length;
    }
}
