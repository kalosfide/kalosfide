import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';

export class ReglesDeMotDePasse {
    noSpaces: boolean;
    requiredLength: number;
    requireDigit: boolean;
    requireLowercase: boolean;
    requireUppercase: boolean;
    requireNonAlphanumeric: boolean;

    static créeValidateurs(règles: ReglesDeMotDePasse): KfValidateur[] {
        const validateurs: KfValidateur[] = [];
        const fabrique = KfValidateurs;
        if (règles.noSpaces) {
            validateurs.push(fabrique.noSpaces);
        }
        if (règles.requiredLength) {
            validateurs.push(fabrique.requiredLength(règles.requiredLength));
        }
        if (règles.requireDigit) {
            validateurs.push(fabrique.requireDigit);
        }
        if (règles.requireLowercase) {
            validateurs.push(fabrique.requireLowercase);
        }
        if (règles.requireUppercase) {
            validateurs.push(fabrique.requireUppercase);
        }
        if (règles.requireNonAlphanumeric) {
            validateurs.push(fabrique.requireNonAlphanumeric);
        }
        return validateurs;
    }


}
