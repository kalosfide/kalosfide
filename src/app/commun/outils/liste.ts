import { Evaluateur } from './evaluateur';
import { Evénement, Signal } from './evenement';

export enum TypeDEvenementDeListe {
    ajoute = 'ajoute',
    supprime = 'supprime',
    deplace = 'deplace',
    vide = 'vide',
    remplit = 'remplit'
}

export interface EvenementDeListe {
    type: TypeDEvenementDeListe;
    data: any;
}

export interface Abonnement {
    abonné: any;
    type: TypeDEvenementDeListe;
    distribue: (evenement: EvenementDeListe) => void;
}
export interface DétailAjoute {
    Objet: any;
    Index: number;
}
export interface DétailSupprime {
    /** index de la suppression */
    Index: number;
    /** objet supprimé */
    objet: any;
}
export interface DétailDéplace {
    IndexAvant: number;
    IndexAprès: number;
}

class Gestionnaire {
    litIndex: () => number;
    fixeIndex: (index: number) => void;

    constructor(litIndex: () => number, fixeIndex: (index: number) => void) {
        this.litIndex = litIndex;
        this.fixeIndex = fixeIndex;
    }

    private get index(): number {
        return this.litIndex();
    }
    private set index(valeur: number) {
        this.fixeIndex(valeur);
    }

    TraiteAjoute(détail: DétailAjoute) {
        if (détail.Index <= this.index) {
            this.index++;
        }
    }
    TraiteSupprime(détail: DétailSupprime) {
        let index = this.index;
        if (détail.Index < index) {
            index--;
        } else {
            if (détail.Index === index) {
                index = -1;
            }
        }
        if (index !== this.index) {
            this.index = index;
        }
    }
    TraiteDéplace(détail: DétailDéplace) {
        let index = this.index;
        if (détail.IndexAvant === index) {
            index = détail.IndexAprès;
        } else {
            if (détail.IndexAvant < index && index <= détail.IndexAprès) {
                index--;
            }
        }
        if (index !== this.index) {
            this.index = index;
        }
    }
    TraiteRemplit() {
        this.index = -1;
    }
    TraiteVide() {
        this.index = -1;
    }
}

export interface ReglesDIndexDeListe {
    supprime: {
        /** si true, après la suppression de objet(this.index),
         * this.index = this.index === this.Nb ? this.index : this.index - 1
         * l'objet en cours est l'objet qui suivait l'objet supprimé ou à défaut le nouveau dernier
         */
        conserveIndexOuResteDernier?: boolean,
    };
    remplit: {
        /** si true, après le remplissage de la liste
         * this.index =
         */
        conserveIndex?: boolean,
        /** < 0 => this.index = -1; 0 => this.index = 0; > 0 => this.index = this.Nb - 1; */
        indexParDefaut: number,
    };
}

export class Liste {

    private _index: number;
    private tableau: any[] = [];
    private abonnements: Abonnement[];
    AvecOrdreAuto: boolean;
    SansDoublon: boolean;
    private évaluateurIdentité: (o1: any, o2: any) => boolean;
    private évaluateurValeur: (o1: any, o2: any) => number;
    nomPropriétéValeur: string;

    reglesDIndex: ReglesDIndexDeListe;

    private indexChangé: Signal;

    constructor() {
        this._index = -1;
        this.indexChangé = new Signal;
        this.SansDoublon = false;
        this.AvecOrdreAuto = false;
        this.reglesDIndex = {
            supprime: {
                conserveIndexOuResteDernier: true,
            },
            remplit: {
                conserveIndex: true,
                indexParDefaut: -1,
            }
        };
    }

    FixeEvaluateurIdentité(évaluateurIdentité: (o1: any, o2: any) => boolean) {
        this.évaluateurIdentité = évaluateurIdentité;
    }
    FixeEvaluateurValeur(évaluateurValeur: (o1: any, o2: any) => number) {
        this.évaluateurValeur = évaluateurValeur;
    }

    get Objets(): any[] { return this.tableau; }

    Objet(index: number): any {
        return (index < 0 || index >= this.tableau.length) ? undefined : this.tableau[index];
    }

    IndexDe(objet: any) {
        return this.tableau.findIndex((o) => this.SontIdentiques(o, objet));
    }

    SontIdentiques(objet1: any, objet2: any): boolean {
        if ((objet1 && !objet2) || (!objet1 && objet2)) { return false; }
        if (objet1 === objet2) { return true; }
        let nomValeur = 'value';
        if (objet1[nomValeur]) {
            return (objet2[nomValeur]) ? objet1[nomValeur] === objet2[nomValeur] : false;
        }
        nomValeur = 'valeur';
        if (objet1[nomValeur]) {
            return (objet2[nomValeur]) ? objet1[nomValeur] === objet2[nomValeur] : false;
        }
        if (this.évaluateurIdentité) {
            return this.évaluateurIdentité(objet1, objet2);
        }
    }

    get Nb(): number { return this.tableau.length; }

    private PremierIndexAprès(objet: any, dans: any[]): number {
        let index = -1;
        if (this.évaluateurValeur) {
            index = dans.findIndex(
                (o) => this.évaluateurValeur(o, objet) > 0
            );
        }
        if (index === -1) {
            index = dans.length;
        }
        return index;
    }
    Ajoute(objet: any) {
        if (this.SansDoublon !== true || this.IndexDe(objet) === -1) {
            const index = (this.AvecOrdreAuto) ? this.PremierIndexAprès(objet, this.tableau) : this.Nb;
            this.tableau.splice(index, 0, objet);
            if (this.abonnements) {
                this.publie({
                    type: TypeDEvenementDeListe.ajoute,
                    data: { Objet: objet, Index: index }
                });
            }
            this.index = index;
        }
    }


    /** si true, après la suppression de objet(this.index),
     * this.index = this.index === this.Nb ? this.index : this.index - 1
     * l'objet suivant devient l'objet en cours ou le précédent pour le dernier
     */
    Supprime(index: number | undefined) {
        if (index === undefined) {
            index = this.index;
        }
        const objet = this.tableau.splice(index, 1)[0];
        if (this.abonnements) {
            this.publie({
                type: TypeDEvenementDeListe.supprime,
                data: {
                    Index: index,
                    objet: objet
                }
            });
        }
        if (index < this._index) {
            this.index -= 1;
        } else {
            if (index === this._index) {
                this.index = this.reglesDIndex.supprime.conserveIndexOuResteDernier
                    ? this._index < this.Nb - 1
                        ? this._index // pas le dernier, index inchangé
                        : this._index - 1
                    : -1;
            }
        }
    }
    RemplaceObjetEnCours(nouveau: any) {
        let index = this._index;
        if (this.SansDoublon === true || this.AvecOrdreAuto === true) {
            const t = Array.from(this.tableau).splice(this._index, 1);
            if (this.SansDoublon === true) {
                if (t.find((o) => this.SontIdentiques(o, nouveau))) {
                    return;
                }
            }
            if (this.AvecOrdreAuto === true) {
                index = this.PremierIndexAprès(nouveau, t);
            }
        }
        const objet = this.tableau.splice(this._index, 1)[0];
        if (this.abonnements) {
            this.publie({
                type: TypeDEvenementDeListe.supprime,
                data: { Index: index }
            });
        }
        this.tableau.splice(index, 0, nouveau);
        if (this.abonnements) {
            this.publie({
                type: TypeDEvenementDeListe.ajoute,
                data: { Objet: nouveau, IndexDeLAjout: index }
            });
        }
        this.index = index;
    }
    Monte() {
        if (this._index > 0) {
            const objet = this.tableau.splice(this._index - 1, 1)[0];
            this.tableau.splice(this._index, 0, objet);
            if (this.abonnements) {
                this.publie({
                    type: TypeDEvenementDeListe.deplace,
                    data: { IndexAvant: this._index, IndexAprès: this._index - 1 }
                });
            }
            this.index = this._index - 1;
        }
    }
    Descend() {
        if (this._index < this.tableau.length - 1) {
            const objet = this.tableau.splice(this._index + 1, 1)[0];
            this.tableau.splice(this._index, 0, objet);
            if (this.abonnements) {
                this.publie({
                    type: TypeDEvenementDeListe.deplace,
                    data: { IndexAvant: this._index, IndexAprès: this._index + 1 }
                });
            }
            this.index = this._index + 1;
        }
    }

    Remplit(objets: any[]) {
        this.tableau = Array.from(objets);
        if (!this.reglesDIndex.remplit.conserveIndex) {
            this.index = this.reglesDIndex.remplit.indexParDefaut;
        }
        if (this.index >= this.Nb) {
            this.index = -1;
        }
        if (this.abonnements) {
            this.publie({
                type: TypeDEvenementDeListe.remplit,
                data: null
            });
        }
    }
    Vide() {
        this.tableau.length = 0;
        this.index = -1;
        if (this.abonnements) {
            this.publie({
                type: TypeDEvenementDeListe.vide,
                data: null
            });
        }
    }

    // EVENEMENTS

    Abonne(abonné: any, type: TypeDEvenementDeListe, reception: (evenement: EvenementDeListe) => void) {
        const abonnement: Abonnement = {
            abonné: abonné,
            type: type,
            distribue: reception
        };
        if (this.abonnements) {
            this.abonnements.push(abonnement);
        } else {
            this.abonnements = [abonnement];
        }
    }
    Désabonne(abonné: any, type: TypeDEvenementDeListe) {
        this.abonnements = this.abonnements.filter(
            a => a.abonné !== abonné || a.type !== type
        );
    }
    AbonneListeLiée(litIndex: () => number, fixeIndex: (index: number) => void) {
        const gestionnaire = new Gestionnaire(litIndex, fixeIndex);
        this.Abonne(gestionnaire,
            TypeDEvenementDeListe.ajoute,
            (evenement: EvenementDeListe) => gestionnaire.TraiteAjoute(evenement.data));
        this.Abonne(gestionnaire,
            TypeDEvenementDeListe.supprime,
            (evenement: EvenementDeListe) => gestionnaire.TraiteSupprime(evenement.data));
        this.Abonne(gestionnaire,
            TypeDEvenementDeListe.deplace,
            (evenement: EvenementDeListe) => gestionnaire.TraiteDéplace(evenement.data));
        this.Abonne(gestionnaire,
            TypeDEvenementDeListe.vide,
            (evenement: EvenementDeListe) => gestionnaire.TraiteVide());
        this.Abonne(gestionnaire,
            TypeDEvenementDeListe.remplit,
            (evenement: EvenementDeListe) => gestionnaire.TraiteRemplit());
    }

    private publie(evenement: EvenementDeListe) {
        this.abonnements.forEach(
            a => {
                if (a.type === evenement.type) {
                    a.distribue(evenement);
                }
            }
        );
    }

    AbonneAIndexChangé(abonné: () => void) {
        this.indexChangé.Abonne(abonné);
    }
    DésabonneAIndexChangé(abonné: () => void) {
        this.indexChangé.Désabonne(abonné);
    }
    IndexChangé() {
        this.indexChangé.Publie();
    }

    get ObjetEnCours(): any {
        return this.Objet(this._index);
    }
    set ObjetEnCours(objet: any) {
        this.index = this.IndexDe(objet);
    }

    get index(): number {
        return this.Nb > 0 ? this._index : -1;
    }
    set index(index: number) {
        const i = index >= 0 && index < this.Nb ? index : -1;
        if (i !== this._index) {
            this._index = index;
            this.IndexChangé();
        }
    }

}
