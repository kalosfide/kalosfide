import { Arbre } from './arbre';

export class Noeud {
    objet: object;
    private pId: string;
    private pParent: Noeud;
    private pEnfant: Noeud;
    private pSuivant: Noeud;

    get id(): string { return this.pId; }
    get parent(): Noeud { return this.pParent; }
    get enfant(): Noeud { return this.pEnfant; }
    get suivant(): Noeud { return this.pSuivant; }
    get racine(): Noeud {
        if (this.pParent) {
            return this.pParent.racine;
        } else {
            return this;
        }
    }

    enregistreEnfants(arbre: Arbre) {
        this.pId = '' + arbre.enregistre(this);
        let e = this.pEnfant;
        while (e !== undefined) {
            e.enregistreEnfants(arbre);
            e = e.pSuivant;
        }
    }
    get estFeuille(): boolean { return this.pEnfant === undefined; }
    Enfant(index: number): Noeud {
        let e = this.pEnfant;
        let i = index;
        while (e !== undefined && i !== 0) {
            i--;
            e = e.pSuivant;
        }
        return e;
    }
    IndexDe(noeud: Noeud): number {
        let e = this.pEnfant;
        let i = -1;
        let j = 0;
        while (e !== undefined) {
            if (e === noeud) {
                i = j;
                break;
            }
            j++;
            e = e.pSuivant;
        }
        return i;
    }
    get IndexDesAncêtres(): number[] {
        if (this.pParent === undefined) { return []; }
        const ids = Array.from(this.pParent.IndexDesAncêtres);
        ids.push(this.pParent.IndexDe(this));
        return ids;
    }
    ObjetsEnfants(): object[] {
        const o: object[] = [];
        let e = this.pEnfant;
        while (e !== undefined) {
            o.push(e.objet);
            e = e.pSuivant;
        }
        return o;
    }
    get Enfants(): Noeud[] {
        const n: Noeud[] = [];
        let e = this.pEnfant;
        while (e !== undefined) {
            n.push(e);
            e = e.pSuivant;
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
        let e = this.pEnfant;
        while (e) {
            e.Applique(methode, nouveauParamètres);
            e = e.pSuivant;
        }
        return nouveauParamètres;
    }

    Transforme(transformeObjet: (objet: any) => any): Noeud {
        const nouveau = new Noeud();
        nouveau.objet = transformeObjet(this.objet);
        let e = this.pEnfant;
        while (e) {
            nouveau.Ajoute(e.Transforme(transformeObjet));
            e = e.pSuivant;
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
        let d = this.pEnfant;
        if (d !== undefined) {
            while (d.pSuivant !== undefined) {
                d = d.pSuivant;
            }
        }
        return d;
    }
    get Précédent(): Noeud {
        let p = this.pParent;
        if (p === undefined) { return undefined; }
        p = p.pEnfant;
        if (p === this) { return undefined; }
        while (p.pSuivant !== undefined) {
            if (p.pSuivant === this) { return p; }
            p = p.pSuivant;
        }
        return undefined;
    }
    private fixeParent(parent: Noeud) {
        const ancienParent = this.pParent;
        if (ancienParent === parent) { return; }
        if (ancienParent !== undefined) {
            const précédent = this.Précédent;
            if (précédent === undefined) {
                ancienParent.pEnfant = this.pSuivant;
            } else {
                précédent.pSuivant = this.pSuivant;
            }
        }
        this.pParent = parent;
    }
    Ajoute(noeud: Noeud) {
        const dernier = this.DernierEnfant;
        if (dernier === undefined) {
            this.pEnfant = noeud;
        } else {
            dernier.pSuivant = noeud;
        }
        noeud.fixeParent(this);
    }
    AdopteEnfants(noeud: Noeud) {
        const dernier = this.DernierEnfant;
        let enfant = noeud.pEnfant;
        if (!enfant) {
            return;
        }
        if (dernier === undefined) {
            this.pEnfant = noeud;
        } else {
            dernier.pSuivant = noeud;
        }
        while (enfant) {
            enfant.pParent = this;
            enfant = enfant.pSuivant;
        }
    }
    /**
     * Ce noeud est remplacé par nouveauParent dans les enfants de son parent et devient l'enfant de nouveauParent
     * @param nouveauParent nouveau parent de ce noeud
     */
    InséreParent(nouveauParent: Noeud) {
        if (this.pParent !== undefined) {
            if (this.pParent.pEnfant === this) {
                this.pParent.pEnfant = nouveauParent;
            } else {
                this.Précédent.pSuivant = nouveauParent;
            }
            nouveauParent.pParent = this.pParent;
            nouveauParent.pSuivant = this.pSuivant;
            this.pSuivant = undefined;
        }
        nouveauParent.pEnfant = this;
        this.pParent = nouveauParent;
    }
    Insére(noeud: Noeud, après?: boolean) {
        if (this.pParent === undefined) { return; }
        let suivant: Noeud;
        if (après === true) {
            suivant = this.pSuivant;
            this.pSuivant = noeud;
            noeud.pSuivant = suivant;
        } else {
            if (this.pParent.pEnfant === this) {
                this.pParent.pEnfant = noeud;
            } else {
                this.Précédent.pSuivant = noeud;
            }
            suivant = this;
        }
        noeud.pSuivant = suivant;
        noeud.fixeParent(this.pParent);
    }
    Supprime() {
        if (this.pParent === undefined) { return; }
        const précédent = this.Précédent;
        if (précédent === undefined) {
            this.pParent.pEnfant = this.pSuivant;
        } else {
            précédent.pSuivant = this.pSuivant;
        }
        this.pParent = undefined;
    }

    get bas(): Noeud {
        return this.pSuivant ? this.pSuivant : this.pParent ? this.parent.enfant : undefined;
    }

    get haut(): Noeud {
        if (this.pParent) {
            let enfant = this.pParent.pEnfant;
            while (enfant) {
                if (this === enfant.pSuivant) {
                    break;
                }
                enfant = enfant.pSuivant;
            }
            return enfant;
        }
    }

}
