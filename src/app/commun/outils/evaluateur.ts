/*
* class Evaluateur
    Permet d'obtenir une fonction Evalue
*/
export class Evaluateur {
    private objet: any;
    private nomPropriétéValeur: string;
    private évalue: (objet: any) => boolean | number | string;

    constructor(objet: any, NomPropriétéValeur?: string) {
        if (typeof (objet) === 'boolean') {
            this.évalue = this.Boolean;
            return;
        }
        if (typeof (objet) === 'string') {
            this.évalue = this.String;
            return;
        }
        if (typeof (objet) === 'number') {
            this.évalue = this.Number;
            return;
        }
        if (NomPropriétéValeur !== undefined) {
            if (typeof (objet[NomPropriétéValeur]) === 'boolean') {
                this.évalue = this.PropriétéBoolean;
                return;
            }
            if (typeof (objet[NomPropriétéValeur]) === 'string') {
                this.évalue = this.PropriétéString;
                return;
            }
            if (typeof (objet[NomPropriétéValeur]) === 'number') {
                this.évalue = this.PropriétéNumber;
                return;
            }
            this.évalue = this.PropriétéJSON;
            return;
        }
        this.évalue = this.JSON;
    }

    set Objet(objet: any) {
        this.objet = objet;
    }

    private Boolean(o: any): boolean {
        return <boolean>o;
    }
    private Number(o: any): number {
        return <number>o;
    }
    private String(o: any): string {
        return <string>o;
    }
    private JSON(o: any): string {
        return JSON.stringify(o);
    }
    private PropriétéBoolean(o: any): boolean {
        return <boolean>o[this.nomPropriétéValeur];
    }
    private PropriétéNumber(o: any): number {
        return <number>o[this.nomPropriétéValeur];
    }
    private PropriétéString(o: any): string {
        return <string>o[this.nomPropriétéValeur];
    }
    private PropriétéJSON(o: any): string {
        return JSON.stringify(o[this.nomPropriétéValeur]);
    }
    Evalue(objet: any): boolean | number | string {
        return this.évalue(objet);
    }
    get Evaluation(): (objet: any) => boolean | number | string {
        return this.évalue;
    }
    EstEgal(objet: any): boolean {
        return this.évalue(this.objet) === this.évalue(objet);
    }
    get Egalité(): (objet: any) => boolean {
        return this.EstEgal;
    }
    CompareA(objet: any): number {
        const v0 = this.évalue(this.objet);
        const v = this.évalue(objet);
        return v0 < v ? -1 : v0 > v ? 1 : 0;
    }
    EstAvant(objet: any): boolean {
        return this.CompareA(objet) === -1;
    }
    EstAprès(objet: any): boolean {
        return this.CompareA(objet) === +1;
    }
    get Comparaison(): (o: any) => number {
        return this.CompareA;
    }
}
