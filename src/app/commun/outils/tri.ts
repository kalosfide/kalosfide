export class Tri<T> {
    nom: string;
    desc: boolean;
    compare: (t1: T, t2: T) => number;

    constructor(nom: string, compare: (t1: T, t2: T) => number, desc?: boolean) {
        this.nom = nom;
        this.compare = compare;
        this.desc = desc;
    }

    get prochainDesc(): boolean {
        return this.desc !== true;
    }

    trie(liste: T[]): T[] {
        liste = liste.sort(this.compare);
        if (this.desc === true) {
            liste = liste.reverse();
        }
        return liste;
    }

    trieObjets<TObjet>(liste: TObjet[], parent: (objet: TObjet) => T): TObjet[] {
        let l = liste.sort((d1: TObjet, d2: TObjet): number => this.compare(parent(d1), parent(d2)));
        if (this.desc === true) {
            l = l.reverse();
        }
        return l;
    }
}
