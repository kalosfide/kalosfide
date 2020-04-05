import { Chiffreur } from './chiffreur';

export class TimbreurDateur {

    private début: number;
    private chiffreur: Chiffreur;

    constructor() {
        this.chiffreur = new Chiffreur('kalosfide0123456789KALOSFIDE');
        const d = new Date;
        d.setTime(0);
        d.setFullYear(2018, 1, 1);
        this.début = d.valueOf();
    }

    TimbreDeValeur(millisecondes: number): string {
        return this.chiffreur.texte(millisecondes);
    }

    TimbreDeDate(date: Date): string {
        return this.TimbreDeValeur(date.valueOf() - this.début);
    }

    DateDeTimbre(timbre: string): Date {
        const d = new Date;
        d.setTime(this.début + this.chiffreur.valeur(timbre));
        return d;
    }

}
