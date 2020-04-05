import { estNombre } from './est-nombre';
import { Dateur } from './dateur';

class TexteDate {

    private formate2chiffres(nombre: number): string {
        return (nombre < 10 ? '0' : '') + nombre;
    }

    private _h_Min(date: Date): string {
        return [
            this.formate2chiffres(date.getHours()),
            this.formate2chiffres(date.getMinutes() + 1),
        ].join(':');
    }
    h_Min(date: Date): string {
        const surementUneDate = new Date(date);
        return this._h_Min(surementUneDate);
    }
    private _en_chiffres(date: Date): string {
        return [
            this.formate2chiffres(date.getDate()),
            this.formate2chiffres(date.getMonth() + 1),
            date.getFullYear()
        ].join('/');
    }
    en_chiffres(date: Date): string {
        const surementUneDate = new Date(date);
        return this._en_chiffres(surementUneDate);
    }
    en_chiffresHMin(date: Date): string {
        const surementUneDate = new Date(date);
        return this.en_chiffres(surementUneDate) + ' ' + this.h_Min(surementUneDate);
    }
    aujourdHui(date: Date): string {
        const surementUneDate = new Date(date);
        return Dateur.estAujourdhui(surementUneDate) ? `aujourd'hui` : this.en_chiffres(surementUneDate);
    }
    hierAujourdHuiDemain(date: Date): string {
        const surementUneDate = new Date(date);
        return Dateur.estAujourdhui(surementUneDate) ? `aujourd'hui`
            : Dateur.estDemain(surementUneDate) ? 'demain'
                : Dateur.estHier(surementUneDate) ? 'hier'
                    : this.en_chiffres(surementUneDate);
    }
    texteAujourdHuiHMin(date: Date): string {
        const surementUneDate = new Date(date);
        return this.aujourdHui(surementUneDate) + ' ' + this.h_Min(surementUneDate);
    }
    texteAujourdHuiDemainHMin(date: Date): string {
        const surementUneDate = new Date(date);
        return this.hierAujourdHuiDemain(surementUneDate) + ' ' + this.h_Min(surementUneDate);
    }

    en_lettres(date: Date): string {
        const surementUneDate = new Date(date);
        const mois: string[] = [
            'janvier',
            'février',
            'mars',
            'avril',
            'mai',
            'juin',
            'juillet',
            'août',
            'septembre',
            'octobre',
            'novembre',
            'décembre'
        ];
        return `${surementUneDate.getDate()} ${mois[surementUneDate.getMonth()]} ${surementUneDate.getFullYear()}`;
    }

    en_lettresAvecJour(date: Date): string {
        const surementUneDate = new Date(date);
        const jours: string[] = [
            'lundi',
            'mardi',
            'mercredi',
            'jeudi',
            'vendredi',
            'samedi',
            'dimanche',
        ];
        return `${jours[surementUneDate.getDay()]} ${this.en_lettres(surementUneDate)}`;
    }

}

export class TexteOutils {

    static date = new TexteDate();

    /**
     * met en minuscule la première lettre
     */
    static initiale(texte: string): string {
        const initial = texte.substr(0, 1);
        const reste = texte.substring(1);
        return initial.toLowerCase() + reste;
    }

    /**
     * met en majuscule la première lettre
     */
    static Initiale(texte: string): string {
        const initial = texte.substr(0, 1);
        const reste = texte.substring(1);
        return initial.toLocaleUpperCase() + reste;
    }

    /**
     * Retourne un nombre écrit en chiffres ou texteSiPasNombre si le paramètre n'est pas un nombre
     * @param texteSiPasNombre par défaut, ''
     */
    static nombre(nombre: number, texteSiPasNombre?: string): string {
        return estNombre(nombre)
            ? nombre.toLocaleString('fr-FR')
            : texteSiPasNombre
                ? texteSiPasNombre
                : '';
    }

    /**
     * Retourne un nombre écrit en toutes lettres ou texteSiPasNombre si le paramètre n'est pas un nombre
     * @param texteSiPasNombre par défaut, ''
     */
    static en_toutes_lettres(nombre: number, options?: {
        unitéFéminin?: boolean,
        unité?: string,
        unités?: string,
        séparateur?: string,
        nbDécimales?: number,
        sous_unitéFéminin?: boolean,
        sous_unité?: string,
        sous_unités?: string,
        texteSiPasNombre?: string,
    }): string {
        if (!estNombre(nombre)) {
            return '';
        }
        if (nombre === 0) {
            return 'zéro';
        }
        let texte = '';
        if (nombre < 0) {
            texte = 'moins ';
            nombre = -nombre;
        }
        const parties = ('' + nombre).split('.').map(s => parseInt(s, 10));
        const partieEntière = parties[0];
        if (partieEntière !== 0) {
            const féminin = options ? options.unitéFéminin : undefined;
            texte += TexteOutils._en_toutes_lettres(partieEntière, féminin);
            if (options) {
                if (options.unité && partieEntière === 1) {
                    texte += ' ' + options.unité;
                }
                if (options.unités && partieEntière > 1) {
                    texte += ' ' + options.unités;
                }
            }
        }
        let partieDécimale = parties.length > 1 ? parties[1] : 0;
        if (partieEntière !== 0 && partieDécimale !== 0) {
            texte += ((options && options.séparateur) ? ` ${options.séparateur} ` : ' ');
        }
        if (partieDécimale !== 0) {
            if (options && options.nbDécimales > 0) {
                partieDécimale = nombre - partieEntière;
                for (let i = 0; i < options.nbDécimales; i++) {
                    partieDécimale *= 10;
                }
            }
            const féminin = options ? options.sous_unitéFéminin : undefined;
            texte += TexteOutils._en_toutes_lettres(partieDécimale, féminin);
            if (options) {
                if (options.sous_unité && partieDécimale === 1) {
                    texte += ' ' + options.sous_unité;
                }
                if (options.sous_unités && partieDécimale > 1) {
                    texte += ' ' + options.sous_unités;
                }
            }
        }
        return texte;
    }

    private static _en_toutes_lettres_de_1_à_999(nombre: number, féminin?: boolean): string {
        const unitésEnLettres: string[] = [
            '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
            'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'
        ];
        const dizainesEnLettres: string[] = [
            '', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'
        ];

        const unités = nombre % 10;
        const dizaines = (nombre % 100 - unités) / 10;
        const centaines = (nombre % 1000 - nombre % 100) / 100;

        let texte = '';
        const tiret = (n1: number, n2: number) => {
            if (n1 > 0 && n2 > 0) {
                texte += '-';
            }
        };
        if (centaines > 0) {
            if (centaines > 1) {
                texte += unitésEnLettres[centaines] + ' ';
            }
            texte += 'cent';
            if (centaines > 1 && dizaines === 0 && unités === 0) {
                texte += 's';
            }
            if (dizaines > 0 || unités > 0) {
                texte += ' ';
            }
        }
        switch (dizaines) {
            case 0:
                texte += unitésEnLettres[unités];
                break;
            case 1:
                texte += unités === 0 ? dizainesEnLettres[dizaines] : unitésEnLettres[10 + unités];
                break;
            case 7:
                texte += dizainesEnLettres[dizaines];
                texte += unités === 0 ? '' : (unités === 1 ? '-et-' : '-') + unitésEnLettres[10 + unités];
                break;
            case 8:
                texte += dizainesEnLettres[dizaines];
                texte += unités === 0 ? 's' : '-' + unitésEnLettres[10 + unités];
                break;
            case 9:
                texte += dizainesEnLettres[dizaines];
                texte += unités === 0 ? '' : '-' + unitésEnLettres[10 + unités];
                break;
            default:
                texte += dizainesEnLettres[dizaines];
                texte += unités === 0 ? '' : (unités === 1 ? '-et-' : '-') + unitésEnLettres[unités];
                break;
        }
        if (féminin && unités === 1 && dizaines === 0) {
            texte += 'e';
        }
        return texte;
    }

    private static _en_toutes_lettres(nombre: number, féminin: boolean): string {
        const de1A999 = nombre % 1000;
        const milliers = (nombre % 1000000 - nombre % 1000) / 1000;
        const millions = (nombre % 1000000000 - nombre % 1000000) / 1000000;
        const milliards = (nombre % 1000000000 - nombre % 1000000) / 1000000;

        let texte = '';
        const espace = (n1: number, n2: number) => {
            if (n1 > 0 && n2 > 0) {
                texte += ' ';
            }
        };
        const metUnS = (n: number) => {
            if (n > 1) {
                texte += 's';
            }
        };
        if (milliards > 0) {
            texte += TexteOutils._en_toutes_lettres_de_1_à_999(milliards) + ' milliard';
            metUnS(milliards);
        }
        espace(milliards, millions);
        if (millions > 0) {
            texte += TexteOutils._en_toutes_lettres_de_1_à_999(millions) + ' million';
            metUnS(millions);
        }
        espace(millions, milliers);
        if (milliers > 0) {
            texte += milliers === 1 ? 'mille' : TexteOutils._en_toutes_lettres_de_1_à_999(milliers) + ' mille';
        }
        espace(milliers, de1A999);
        if (de1A999 > 0) {
            texte += TexteOutils._en_toutes_lettres_de_1_à_999(de1A999, féminin);
        }
        return texte;
    }
}
