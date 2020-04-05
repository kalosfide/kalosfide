import { Arbre } from './arbre';

export class Noeud {
    objet: object;
    private _id: string;
    private _parent: Noeud;
    private _enfant: Noeud;
    private _suivant: Noeud;

    get id(): string { return this._id; }
    get parent(): Noeud { return this._parent; }
    get enfant(): Noeud { return this._enfant; }
    get suivant(): Noeud { return this._suivant; }
    get racine(): Noeud {
        if (this._parent) {
            return this._parent.racine;
        } else {
            return this;
        }
    }

    enregistreEnfants(arbre: Arbre) {
        this._id = '' + arbre.enregistre(this);
        let e = this._enfant;
        while (e !== undefined) {
            e.enregistreEnfants(arbre);
            e = e._suivant;
        }
    }
    get estFeuille(): boolean { return this._enfant === undefined; }
    Enfant(index: number): Noeud {
        let e = this._enfant;
        let i = index;
        while (e !== undefined && i !== 0) {
            i--;
            e = e._suivant;
        }
        return e;
    }
    IndexDe(noeud: Noeud): number {
        let e = this._enfant;
        let i = -1;
        let j = 0;
        while (e !== undefined) {
            if (e === noeud) {
                i = j;
                break;
            }
            j++;
            e = e._suivant;
        }
        return i;
    }
    get IndexDesAncêtres(): number[] {
        if (this._parent === undefined) { return []; }
        const ids = Array.from(this._parent.IndexDesAncêtres);
        ids.push(this._parent.IndexDe(this));
        return ids;
    }
    ObjetsEnfants(): object[] {
        const o: object[] = [];
        let e = this._enfant;
        while (e !== undefined) {
            o.push(e.objet);
            e = e._suivant;
        }
        return o;
    }
    get Enfants(): Noeud[] {
        const n: Noeud[] = [];
        let e = this._enfant;
        while (e !== undefined) {
            n.push(e);
            e = e._suivant;
        }
        return n;
    }

    Clone(): Noeud {
        const noeud = new Noeud();
        noeud.objet = this.objet;
        let enfant: Noeud;
        while (enfant) {
            noeud.Ajoute(enfant.Clone());
            enfant = enfant.suivant;
        }
        return noeud;
    }

    /**
     * Appliquer une méthode à un noeud c'est l'exécuter pour ce noeud puis l'appliquer à ses enfants
     * @param methode lorsque methode est appliquée à un noeud, ce noeud exécute methode puis applique methode à ses enfants
     * @param parametres si l'exécution par le noeud retourne une valeur, cette valeur sert de parametres pour l'application aux enfants
     */
    Applique(methode: (noeud: Noeud, parametres?: any) => any, parametres?: any): any {
        let nouveauParamètres = methode(this, parametres);
        if (!nouveauParamètres) {
            nouveauParamètres = parametres;
        }
        let e = this._enfant;
        while (e) {
            e.Applique(methode, nouveauParamètres);
            e = e._suivant;
        }
        return nouveauParamètres;
    }

    Transforme(transformeObjet: (objet: any) => any): Noeud {
        const nouveau = new Noeud;
        nouveau.objet = transformeObjet(this.objet);
        let e = this._enfant;
        while (e) {
            nouveau.Ajoute(e.Transforme(transformeObjet));
            e = e._suivant;
        }
        return nouveau;
    }

    /**
     * parcourt l'arbre à partir de this en appliquant test à chaque noeud
     * retourne l'array des objets des noeuds qui vérifient test
     * @param methode lorsque test est appliquée à un noeud, ce noeud se teste puis teste ses enfants
     */
    Trouve(test: (objet: any) => boolean): any[] {
        const trouvés: any[] = [];
        this.Applique((noeud: Noeud) => {
            if (test(noeud.objet)) {
                trouvés.push(noeud.objet);
            }
        });
        return trouvés;
    }

    /**
     * retourne tous les objets de ce noeud et de ses descendants
     */
    get Contenus(): any[] {
        return this.Trouve((objet: any) => true);
    }

    get DernierEnfant(): Noeud {
        let d = this._enfant;
        if (d !== undefined) {
            while (d._suivant !== undefined) {
                d = d._suivant;
            }
        }
        return d;
    }
    get Précédent(): Noeud {
        let p = this._parent;
        if (p === undefined) { return undefined; }
        p = p._enfant;
        if (p === this) { return undefined; }
        while (p._suivant !== undefined) {
            if (p._suivant === this) { return p; }
            p = p._suivant;
        }
        return undefined;
    }
    private fixeParent(parent: Noeud) {
        const ancienParent = this._parent;
        if (ancienParent === parent) { return; }
        if (ancienParent !== undefined) {
            const précédent = this.Précédent;
            if (précédent === undefined) {
                ancienParent._enfant = this._suivant;
            } else {
                précédent._suivant = this._suivant;
            }
        }
        this._parent = parent;
    }
    Ajoute(noeud: Noeud) {
        const dernier = this.DernierEnfant;
        if (dernier === undefined) {
            this._enfant = noeud;
        } else {
            dernier._suivant = noeud;
        }
        noeud.fixeParent(this);
    }
    AdopteEnfants(noeud: Noeud) {
        const dernier = this.DernierEnfant;
        let enfant = noeud._enfant;
        if (!enfant) {
            return;
        }
        if (dernier === undefined) {
            this._enfant = noeud;
        } else {
            dernier._suivant = noeud;
        }
        while (enfant) {
            enfant._parent = this;
            enfant = enfant._suivant;
        }
    }
    /**
     * Ce noeud est remplacé par nouveauParent dans les enfants de son parent et devient l'enfant de nouveauParent
     * @param nouveauParent nouveau parent de ce noeud
     */
    InséreParent(nouveauParent: Noeud) {
        if (this._parent !== undefined) {
            if (this._parent._enfant === this) {
                this._parent._enfant = nouveauParent;
            } else {
                this.Précédent._suivant = nouveauParent;
            }
            nouveauParent._parent = this._parent;
            nouveauParent._suivant = this._suivant;
            this._suivant = undefined;
        }
        nouveauParent._enfant = this;
        this._parent = nouveauParent;
    }
    Insére(noeud: Noeud, après?: boolean) {
        if (this._parent === undefined) { return; }
        let suivant: Noeud;
        if (après === true) {
            suivant = this._suivant;
            this._suivant = noeud;
            noeud._suivant = suivant;
        } else {
            if (this._parent._enfant === this) {
                this._parent._enfant = noeud;
            } else {
                this.Précédent._suivant = noeud;
            }
            suivant = this;
        }
        noeud._suivant = suivant;
        noeud.fixeParent(this._parent);
    }
    Supprime() {
        if (this._parent === undefined) { return; }
        const précédent = this.Précédent;
        if (précédent === undefined) {
            this._parent._enfant = this._suivant;
        } else {
            précédent._suivant = this._suivant;
        }
        this._parent = undefined;
    }

    get bas(): Noeud {
        return this._suivant ? this._suivant : this._parent ? this.parent.enfant : undefined;
    }

    get haut(): Noeud {
        if (this._parent) {
            let enfant = this._parent._enfant;
            while (enfant) {
                if (this === enfant._suivant) {
                    break;
                }
                enfant = enfant._suivant;
            }
            return enfant;
        }
    }

}
