import { TypeCommande } from './type-commande';

export class TypeMesure {

    static id = {
        ALaPièce: 'U',
        AuKilo: 'K',
        AuLitre: 'L',
    };

    static Mesures: string[] = [TypeMesure.id.ALaPièce, TypeMesure.id.AuKilo, TypeMesure.id.AuLitre];

    static unité(id: string): string {
        switch (id) {
            case TypeMesure.id.ALaPièce:
                break;
            case TypeMesure.id.AuKilo:
                return 'kg';
            case TypeMesure.id.AuLitre:
                return 'L';
            default:
                throw new Error(`TypeMesure: la valeur ${id} n'appartient pas au type`);
        }
    }

    static texte_le(id: string): string {
        switch (id) {
            case TypeMesure.id.ALaPièce:
                return 'la pièce';
            case TypeMesure.id.AuKilo:
                return 'le kg';
            case TypeMesure.id.AuLitre:
                return 'le L';
            default:
                throw new Error(`TypeMesure: la valeur ${id} n'appartient pas au type`);
        }
    }

    static texte_au(id: string): string {
        switch (id) {
            case TypeMesure.id.ALaPièce:
                return 'à l\'unité';
            case TypeMesure.id.AuKilo:
                return 'au poids';
            case TypeMesure.id.AuLitre:
                return 'au volume';
            default:
                throw new Error(`TypeMesure: la valeur ${id} n'appartient pas au type`);
        }
    }

    static texteSeCommande(idTypeMesure: string, idTypeCommande: string): string {
        if (idTypeMesure === TypeMesure.id.ALaPièce && idTypeCommande !== TypeCommande.id.ALUnité) {
            throw Error('texteSeCommande: Types de commande et de mesure incompatibles');
        }
        if (idTypeCommande === TypeCommande.id.ALUnitéOuEnVrac) {
            return TypeCommande.pourListe(TypeCommande.id.ALUnité) + ' ou ' + TypeMesure.texte_au(idTypeMesure);
        } else {
            return TypeMesure.texte_au(idTypeMesure);
        }
    }
    static texteUnités(idTypeMesure: string, idTypeCommande: string): string {
        switch (idTypeCommande) {
            case TypeCommande.id.ALUnité:
                return 'pièce(s)';
            case TypeCommande.id.EnVrac:
            case TypeCommande.id.ALUnitéOuEnVrac:
                return TypeMesure.unité(idTypeMesure);
        }
    }
    static optionsUnités(idTypeMesure: string, idTypeCommande: string): {
        texte: string,
        valeur: string
    }[] {
        if (idTypeMesure === TypeMesure.id.ALaPièce && idTypeCommande !== TypeCommande.id.ALUnité) {
            throw Error('texteUnités: Types de commande et de mesure incompatibles');
        }
        switch (idTypeCommande) {
            case TypeCommande.id.ALUnité:
                return [
                    { texte: 'pièce(s)', valeur: TypeCommande.id.ALUnité },
                ];
            case TypeCommande.id.EnVrac:
                return [
                    { texte: TypeMesure.unité(idTypeMesure), valeur: TypeCommande.id.EnVrac },
                ];
            case TypeCommande.id.ALUnitéOuEnVrac:
                return [
                    { texte: TypeMesure.unité(idTypeMesure), valeur: TypeCommande.id.EnVrac },
                    { texte: 'pièce(s)', valeur: TypeCommande.id.ALUnité },
                ];
        }
    }

    static typeCommandeParDéfaut(idTypeMesure: string): string {
        switch (idTypeMesure) {
            case TypeMesure.id.ALaPièce:
                return TypeCommande.id.ALUnité;
            default:
                return TypeCommande.id.EnVrac;
        }
    }
}
