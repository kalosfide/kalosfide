import { Noeud } from './noeud';

export class Arbre {
    private _racine: Noeud;
    private _ids: string[] = [];
    private _noeuds: Noeud[] = [];

    constructor() {
        this._racine = new Noeud;
    }

    enracine(racine?: Noeud) {
        if (racine) {
            this._racine = racine;
        }
       this._racine.enregistreEnfants(this);
    }

    enregistre(noeud: Noeud): number {
        this._noeuds.push(noeud);
        return this._noeuds.length;
    }

    get racine(): Noeud { return this._racine; }

    private noeudDe(id: number[]): Noeud {
        if (id.length > 0) {
            const parent = this.noeudDe(this.idParent(id));
            if (parent === undefined) { return undefined; }
            return parent.Enfant(id[id.length - 1]);
        }
        return this._racine;
    }
    private idParent(id: number[]): number[] {
        if (id.length > 0) {
            const idParent = Array.from(id);
            idParent.pop();
            return idParent;
        }
        return [];
    }

    /**
     * parcourt l'arbre à partir de la racine en appliquant methode à chaque noeud
     * @param methode lorsque methode est appliquée à un noeud, ce noeud exécute methode puis applique methode à ses enfants
     * @param parametres si l'exécution par le noeud retourne une valeur, cette valeur sert de parametres pour l'application aux enfants
     */
    Applique(methode: (noeud: Noeud, parametres?: any) => any, paramètres?: any) {
        this._racine.Applique(methode, paramètres);
    }

    /**
     * parcourt l'arbre à partir de la racine en appliquant test à chaque noeud
     * retourne l'array des objets des noeuds qui vérifient test
     * @param methode lorsque test est appliquée à un noeud, ce noeud se teste puis teste ses enfants
     */
    Trouve(test: (noeud: Noeud) => boolean): any[] {
        return this._racine.Trouve(test);
    }

    /**
     * retourne tous les objets des noeuds
     */
    get Contenus(): any[] {
        return this.Trouve((noeud: Noeud) => true);
    }

    private méthodeCréeDonnée(noeud: Noeud, données: { 'id': string, 'objet': object }[]) {
        données.push({'id': Id(noeud.IndexDesAncêtres), 'objet': noeud.objet});
    }
    get Données(): { 'id': string, 'objet': object }[] {
        const données: { 'id': string, 'objet': object }[] = [];
        this.Applique(this.méthodeCréeDonnée, données);
        return données;
    }
    set Données(v: { 'id': string, 'objet': object }[]) {
        this._racine = new Noeud();
        for (let i = 0; i < v.length; i++) {
            const d = Indexs(v[i].id);
            const idParent = this.idParent(d);
            const parent = idParent === undefined ? this._racine : this.noeudDe(idParent);
            if (parent !== undefined) {
               // parent.Ajoute(v[i].objet);
            }
        }
    }
}

function Id(indexs: number[]): string {
    return indexs.map<string>((value: number, index: number, array: number[]): string => index.toString()).join('_');
}
function Indexs(id: string): number[] {
    return id.split('_').map<number>((v: string, i: number, a: string[]): number => parseInt(v, 10));
}

