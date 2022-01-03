import { TypeCommande, TypeCommandeFabrique } from './type-commande';

export enum TypeMesure
{
    Aucune,
    Kilo,
    Litre
}

export class TypeMesureFabrique {

    static Mesures: TypeMesure[] = [TypeMesure.Aucune, TypeMesure.Kilo, TypeMesure.Litre];

    static unité(typeMesure: TypeMesure): string {
        switch (typeMesure) {
            case TypeMesure.Aucune:
                return 'pièce';
            case TypeMesure.Kilo:
                return 'kg';
            case TypeMesure.Litre:
                return 'L';
            default:
                throw new Error(`TypeMesure: la valeur ${typeMesure} n'appartient pas au type`);
        }
    }

    static unités(typeMesure: TypeMesure): string {
        switch (typeMesure) {
            case TypeMesure.Aucune:
                return 'pièces';
            case TypeMesure.Kilo:
                return 'kg';
            case TypeMesure.Litre:
                return 'L';
            default:
                throw new Error(`TypeMesure: la valeur ${typeMesure} n'appartient pas au type`);
        }
    }

    static texte_le(typeMesure: TypeMesure): string {
        switch (typeMesure) {
            case TypeMesure.Aucune:
                return 'la pièce';
            case TypeMesure.Kilo:
                return 'le kg';
            case TypeMesure.Litre:
                return 'le L';
            default:
                throw new Error(`TypeMesure: la valeur ${typeMesure} n'appartient pas au type`);
        }
    }

    static texte_au(typeMesure: TypeMesure): string {
        switch (typeMesure) {
            case TypeMesure.Aucune:
                return `à l'unité`;
            case TypeMesure.Kilo:
                return 'au poids';
            case TypeMesure.Litre:
                return 'au volume';
            default:
                throw new Error(`TypeMesure: la valeur ${typeMesure} n'appartient pas au type`);
        }
    }

    static texteSeCommande(typeMesure: TypeMesure, typeCommande: TypeCommande): string {
        if (typeMesure === TypeMesure.Aucune && typeCommande !== TypeCommande.ALUnité) {
            throw Error('texteSeCommande: Types de commande et de mesure incompatibles');
        }
        if (typeCommande === TypeCommande.ALUnitéOuEnVrac) {
            return TypeCommandeFabrique.pourListe(TypeCommande.ALUnité) + ' ou ' + TypeMesureFabrique.texte_au(typeMesure);
        } else {
            return TypeMesureFabrique.texte_au(typeMesure);
        }
    }
    static texteUnités(typeMesure: TypeMesure, typeCommande: TypeCommande): string {
        switch (typeCommande) {
            case TypeCommande.ALUnité:
                return 'pièce(s)';
            case TypeCommande.EnVrac:
            case TypeCommande.ALUnitéOuEnVrac:
                return TypeMesureFabrique.unité(typeMesure);
        }
    }
    static optionsUnités(typeMesure: TypeMesure, typeCommande: TypeCommande): {
        texte: string,
        valeur: TypeCommande
    }[] {
        if (typeMesure === TypeMesure.Aucune && typeCommande !== TypeCommande.ALUnité) {
            throw Error('texteUnités: Types de commande et de mesure incompatibles');
        }
        switch (typeCommande) {
            case TypeCommande.ALUnité:
                return [
                    { texte: 'pièce(s)', valeur: TypeCommande.ALUnité },
                ];
            case TypeCommande.EnVrac:
                return [
                    { texte: TypeMesureFabrique.unité(typeMesure), valeur: TypeCommande.EnVrac },
                ];
            case TypeCommande.ALUnitéOuEnVrac:
                return [
                    { texte: TypeMesureFabrique.unité(typeMesure), valeur: TypeCommande.EnVrac },
                    { texte: 'pièce(s)', valeur: TypeCommande.ALUnité },
                ];
        }
    }

    static typeCommandeParDéfaut(typeMesure: TypeMesure): TypeCommande {
        switch (typeMesure) {
            case TypeMesure.Aucune:
                return TypeCommande.ALUnité;
            default:
                return TypeCommande.EnVrac;
        }
    }
}
