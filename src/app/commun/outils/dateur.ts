
export const MINUTE_EN_MS = 60 * 1000;
export const HEURE_EN_MS = 60 * 60 * 1000;
export const JOURNEE_EN_MS = 24 * 60 * 60 * 1000;

export class Dateur {
    static get maintenant(): Date {
        return new Date();
    }
    static arrondiAuxMinutes(date: Date): Date {
        return new Date(Math.round(date.getTime() / MINUTE_EN_MS) * MINUTE_EN_MS);
    }
    static ajouteHeures(date: Date, heures: number): Date {
        return new Date(date.getTime() + Math.round(heures * HEURE_EN_MS));
    }

    static zéroHeure(date: Date): Date {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return d;
    }
    static get aujourdhui0H(): Date {
        return Dateur.zéroHeure(new Date(Date.now()));
    }
    static get demain0H(): Date {
        const date = Dateur.ajouteJours(Dateur.aujourdhui0H, 1);
        return date;
    }
    static get hier0H(): Date {
        const date = Dateur.ajouteJours(Dateur.aujourdhui0H, -1);
        return date;
    }
    static ajouteJours(date: Date, jours: number): Date {
        return new Date(date.valueOf() + jours * JOURNEE_EN_MS);
    }
    static joursDEcart(date1: Date, date2: Date): number {
        const d1 = Dateur.zéroHeure(date1);
        const d2 = Dateur.zéroHeure(date2);
        return Math.ceil((d1.valueOf() - d2.valueOf()) / JOURNEE_EN_MS);
    }

    static estAujourdhui(date: Date): boolean {
        return Dateur.zéroHeure(date).valueOf() === Dateur.aujourdhui0H.valueOf();
    }
    static estDemain(date: Date): boolean {
        return Dateur.zéroHeure(date).valueOf() === Dateur.demain0H.valueOf();
    }
    static estHier(date: Date): boolean {
        return Dateur.zéroHeure(date).valueOf() === Dateur.hier0H.valueOf();
    }

    // ISO YYYY-MM-DDTHH:mm:ss.sssZ
    static InputDateValue(date: Date): string {
        return date ? date.toISOString().substr(0, 10) : '';
    }
    static InputTimeValue(date: Date): string {
        return date ? date.toLocaleTimeString().substr(0, 5) : '';
    }
    static InputValueToDate(inputDateValue?: string, inputTimeValue?: string): Date {
        const iso = (new Date()).toISOString();
        const date = inputDateValue ? inputDateValue : iso.substr(0, 10);
        const hmin = (inputTimeValue ? inputTimeValue : iso.substr(11, 5)) + ':00.000';
        const z = iso.substring(11 + 12);
        console.log(iso, date + 'T' + hmin + z);
        return new Date(date + 'T' + hmin + z);
    }
}
