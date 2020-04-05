export class Chiffreur {

    private _chiffres: string;
    private _base: number;

    constructor(lChiffres: string) {
        this._chiffres = lChiffres;
        this._base = this._chiffres.length;
    }
    get base(): number { return this._base; }
    private chiffre(nombre: number): string { return this._chiffres[nombre]; }
    private nombre(chiffre: string): number { return this._chiffres.indexOf(chiffre); }

    texte(valeur: number): string {
        let d: number, q: number, r: number;
        let s: string, t: string;
        if (valeur < 0) {
            s = '-';
            d = -valeur;
        } else {
            s = '';
            d = valeur;
        }
        t = '';
        while (d > 0) {
            q = Math.trunc(d / this._base);
            r = d - q * this._base;
            t = this.chiffre(r) + t;
            d = q;
        }
        return s + t;
    }
    valeur(texte: string): number {
        let p1: number; // position du premier chiffre dans texte
        let p:  number; // position du chiffre dans texte
        let c: string; // chiffre dans cette position
        let m: number; // valeur de 1 dans cette position
        let v: number;
        p = texte.length; // on commence à la fin
        if (texte[0] === '-') {
            p1 = 2;
            m = -1;
        } else {
            p1 = 1;
            m = 1;
        }
        v = 0;
        while (p >= p1) {
            c = texte[p - 1];
            v += m * this.nombre(c);
            m *= this._base;
            p -= 1;
        }
        return v;
    }

}

