import { Outils } from './outils';

/*
/*
* class Complexe
*   Représente un nombre complexe
*/
export class Complexe {
    private re: number;
    private im: number;

    /* Membres statiques */
    static Z(reOuAutreComplexe: number | Complexe, im?: number): Complexe {
        return (new Complexe).FixéPar(reOuAutreComplexe, im);
    }
    static get Z0(): Complexe {
        return this.Z(0);
    }
    static get Z1(): Complexe {
        return this.Z(1);
    }
    static get ZI(): Complexe {
        return this.Z(0, 1);
    }
    static ExpI(alpha: number): Complexe {
        return this.Z(Math.cos(alpha), Math.sin(alpha));
    }
    static MinMaxZ(valeurs: Complexe[]): Complexe[] {
        const minMax = Outils.MinMaxAny(valeurs);
        return [<Complexe>minMax[0], <Complexe>minMax[1]];
    }

    get Re(): number { return this.re; }
    set Re(valeur: number) { this.re = valeur; }
    get Im(): number { return this.im; }
    set Im(valeur: number) { this.im = valeur; }
    constructor() {
        this.re = 0;
        this.im = 0;
    }
    get EstComplexe(): boolean { return true; }
    FixéPar(reOuAutreComplexe: number | Complexe, im?: number): Complexe {
        if (reOuAutreComplexe instanceof Complexe) {
            this.re = (<Complexe>reOuAutreComplexe).Re;
            this.im = (<Complexe>reOuAutreComplexe).Im;
        }  else {
            this.re = <number>reOuAutreComplexe;
            this.im = im ? im : 0;
        }
        return this;
    }
    Egale(reOuAutreComplexe: number | Complexe, im?: number): boolean {
        const z = (new Complexe).FixéPar(reOuAutreComplexe, im);
        return this.re === z.Re && this.im === z.Im;
    }
    get Opposé(): Complexe { return (new Complexe).FixéPar(-this.re, -this.im); }
    Plus(reOuAutreComplexe: number | Complexe, im?: number): Complexe {
        const z = (new Complexe).FixéPar(reOuAutreComplexe, im);
        return (new Complexe).FixéPar(this.re + z.Re, this.im + z.Im);
    }
    Moins(reOuAutreComplexe: number | Complexe, im?: number): Complexe {
        return this.Plus(((new Complexe).FixéPar(reOuAutreComplexe, im)).Opposé);
    }
    Fois(reOuAutreComplexe: number | Complexe, im?: number): Complexe {
        const z = (new Complexe).FixéPar(reOuAutreComplexe, im);
        return (new Complexe).FixéPar(this.re * z.Re - this.im * z.Im, this.re * z.Im + this.im * z.Re);
    }
    get ModuleAuCarré(): number { return this.re * this.re + this.im * this.im; }
    get Module(): number { return Math.sqrt(this.ModuleAuCarré); }
    get Conjugué(): Complexe { return (new Complexe).FixéPar(this.re, -this.im); }
    get Inverse(): Complexe { return this.Egale(0) ? null : this.Conjugué.Fois(1 / this.ModuleAuCarré); }
    Sur(reOuAutreComplexe: number | Complexe, im?: number): Complexe {
        return this.Fois((new Complexe).FixéPar(reOuAutreComplexe, im).Inverse);
    }
    get Argument(): number {
        return this.re === 0 ? this.im === 0 ? NaN : this.im > 0 ? Math.PI / 2 : -Math.PI / 2 : 2 * Math.atan2(this.im, this.re);
    }
    set Argument(alpha: number) {
        const m = this.Module;
        this.re = m * Math.cos(alpha);
        this.im = m * Math.sin(alpha);
    }

}
