import { Evaluateur } from './evaluateur';

export class Outils {

    /* retourne -1 si x < min(a, b),  0 si x est entre a et b, 1 si x > max(a, b) */
    static Position(x: number, a: number, b: number): number {
        return (x < a && x < b) ? -1 : (x > a && x > b) ? 1 : 0;
    }
    /* retourne true si min(a, b) <= x <= max(a, b) */
    static EstEntre(x: number, a: number, b: number): boolean {
        return this.Position(x, a, b) === 0;
    }
    /* retourne [min(valeurs), max(valeurs)] */
    static MinMaxAny(valeurs: any[], NomPropriétéValeur?: string): [any, any] {
        let min;
        let max;
        if (valeurs.length) {
            const évaluateur = new Evaluateur(valeurs[0], NomPropriétéValeur);
            for (let i = 1; i < valeurs.length; i++) {
                évaluateur.Objet = valeurs[i];
                if (évaluateur.EstAvant(min)) {
                    min = valeurs[i];
                } else {
                    if (évaluateur.EstAprès(max)) {
                        max = valeurs[i];
                    }
                }
            }
        }
        return [min, max];
    }
    static MinMax(valeurs: number[]): [number, number] {
        const minMax = this.MinMaxAny(valeurs);
        return [<number>minMax[0], <number>minMax[1]];
    }
}
