
export class TypeCommande {
    static id = {
        ALUnité: '1',
        EnVrac: '2',
        ALUnitéOuEnVrac: '3',
    };
    static commandes: string[] = [TypeCommande.id.ALUnité, TypeCommande.id.EnVrac, TypeCommande.id.ALUnitéOuEnVrac];
    static pourListe(id: string): string {
        switch (id) {
            case TypeCommande.id.ALUnité:
                return 'à l\'unité';
            case TypeCommande.id.EnVrac:
                return 'en vrac';
            case TypeCommande.id.ALUnitéOuEnVrac:
                return 'à l\'unité ou en vrac';
            default:
                throw new Error(`TypeCommande: la valeur ${id} n'appartient pas au type`);
        }
    }
    static pourExemple(id: string): string {
        switch (id) {
            case TypeCommande.id.ALUnité:
                return '2 produits';
            case TypeCommande.id.EnVrac:
                return '2,5 kg de produit';
            case TypeCommande.id.ALUnitéOuEnVrac:
                break;
            default:
                throw new Error(`TypeCommande: la valeur ${id} n'appartient pas au type`);
        }
    }
    static pasInputNombre(id: string): number {
        switch (id) {
            case TypeCommande.id.ALUnité:
                return 1;
            case TypeCommande.id.EnVrac:
                return 0.001;
            default:
                break;
        }
    }
}
