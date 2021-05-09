export type DirectionDeTri = 'asc' | 'desc' | '';

export class Tri {
    direction: DirectionDeTri;
    private pCompare: (objet1: any, objet2: any) => number;

    constructor(compare: (objet1: any, objet2: any) => number) {
        this.pCompare = compare;
        this.direction = '';
    }

    directionSuivante() {
        switch (this.direction) {
            case '':
                this.direction = 'asc';
                break;
            case 'asc':
                this.direction = 'desc';
                break;
            case 'desc':
                this.direction = '';
                break;
            default:
                break;
        }
    }

    trie(objets: any[]): any[] {
        switch (this.direction) {
            case 'asc':
                // lignes.sort retourne la même chaîne triée en place
                return [...objets].sort((objet1: any, objet2: any) => this.pCompare(objet1, objet2));
            case 'desc':
                return [...objets].sort((objet1: any, objet2: any) => this.pCompare(objet2, objet1));
            case '':
                return [...objets];
            default:
                break;
        }
    }
}

/**
 * Fabrique de fonctions de comparaison
 */
export class Compare {
    static date(date: (objet: any) => Date): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => {
            const v1 = date(o1);
            const v2 = date(o2);
            return v1 < v2 ? -1 : v1 === v2 ? 0 : 1;
        };
    }
    static dateDesc(date: (objet: any) => Date): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => Compare.date(date)(o2, o1);
    }
    static nombre(nombre: (objet: any) => number): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => {
            const v1 = nombre(o1);
            const v2 = nombre(o2);
            return v1 < v2 ? -1 : v1 === v2 ? 0 : 1;
        };
    }
    static nombreDesc(nombre: (objet: any) => number): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => Compare.nombre(nombre)(o2, o1);
    }
    static texte(texte: (objet: any) => string): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => {
            const v1 = texte(o1);
            const v2 = texte(o2);
            return v1.localeCompare(v2);
        };
    }
    static texteDesc(texte: (objet: any) => string): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => Compare.texte(texte)(o2, o1);
    }
    static booléen(booléen: (objet: any) => boolean): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => {
            const v1 = booléen(o1);
            const v2 = booléen(o2);
            return v1 < v2 ? -1 : v1 === v2 ? 0 : 1;
        };
    }
    static booléenDesc(booléen: (objet: any) => boolean): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => Compare.booléen(booléen)(o2, o1);
    }
    static texteOuNombre(texteOuNombre: (objet: any) => string | number): ((o1: any, o2: any) => number) {
        return (o1: any, o2: any) => {
            const v1 = texteOuNombre(o1);
            const v2 = texteOuNombre(o2);
            if (typeof (v1) === 'string') {
                if (typeof (v2) === 'string') {
                    return v1.localeCompare(v2);
                } else {
                    return -1; // string avant number
                }
            } else {
                if (typeof (v2) === 'string') {
                    return 1; // string avant number
                } else {
                    return v1 < v2 ? -1 : v1 === v2 ? 0 : 1;
                }
            }
        };
    }
    static enchaine(...comparaisons: ((o1: any, o2: any) => number)[]): (o1: any, o2: any) => number {
        return (o1: any, o2: any) => {
            for (const compare of comparaisons) {
                const résultat = compare(o1, o2);
                if (résultat !== 0) {
                    return résultat;
                }
            }
            return 0;
        };
    }
}
