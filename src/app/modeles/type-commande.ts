
export enum TypeCommande {
    ALUnité,
    EnVrac,
    ALUnitéOuEnVrac,
    
}

export class TypeCommandeFabrique {

    static commandes: TypeCommande[] = [TypeCommande.ALUnité, TypeCommande.EnVrac, TypeCommande.ALUnitéOuEnVrac];
    static pourListe(typeCommande: TypeCommande): string {
        switch (typeCommande) {
            case TypeCommande.ALUnité:
                return `à l'unité`;
            case TypeCommande.EnVrac:
                return 'en vrac';
            case TypeCommande.ALUnitéOuEnVrac:
                return `à l'unité ou en vrac`;
            default:
                throw new Error(`TypeCommande: la valeur ${typeCommande} n'appartient pas au type`);
        }
    }
    static pourExemple(typeCommande: TypeCommande): string {
        switch (typeCommande) {
            case TypeCommande.ALUnité:
                return '2 produits';
            case TypeCommande.EnVrac:
                return '2,5 kg de produit';
            case TypeCommande.ALUnitéOuEnVrac:
                break;
            default:
                throw new Error(`TypeCommande: la valeur ${typeCommande} n'appartient pas au type`);
        }
    }
    static pasInputNombre(typeCommande: TypeCommande): number {
        switch (typeCommande) {
            case TypeCommande.ALUnité:
                return 1;
            case TypeCommande.EnVrac:
                return 0.001;
            default:
                break;
        }
    }
}
