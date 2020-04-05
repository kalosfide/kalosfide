import { KfComposant } from '../kf-composant/kf-composant';
import { KfListe } from './kf-liste';
import { KfParametres } from '../kf-composants-parametres';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';

/**
 * contient les informations nécessaires pour créer les items et leur associer leur KfComposantGereValeur
 */
export interface KfListeCreeItemsInterface {
    /**
     * retourne un KfComposantGereValeur initialisé ou un object
     */
    creeItem: () => object;
    /**
     * obligatoire si creeItem retourne un objet qui n'est pas un KfComposantGereValeur
     * retourne un KfComposantGereValeur initialisé
     */
    gereValeur?: (item: object) => KfComposantGereValeur;
    /**
     * pour nommer le composant de l'objet créé
     *      valeur par défaut: KfParametresDesKfComposants.listeParDefaut.nomDeBase
     */
    nomDeBase?: string;
    /**
     * si vrai, les composants créés doivent être des groupes contenant un KfNombre nommé nomId
     */
    avecId?: boolean;
    /**
     * nom du champ du contenu jouant le role d'id numérique
     *      valeur par défaut: KfParametresDesKfComposants.listeParDefaut.id
     */
    nomId?: string;
}

/**
 * objet permettant à la KfListe parent de créer ses items
 *
 * Objectif: traiter les FormArray lors du reset d'un formulaire
 */
export class KfListeCreeItems {

    /**
     * parent du gestionnaire
     */
    liste: KfListe;
    /**
     * retourne un KfComposantGereValeur qui a créé sa _valeur et son abstractControl ou un object
     */
    private _creeItem: () => object;
    /** KfComposantGereValeur de l'item */
    gereValeur: (item: object) => KfComposantGereValeur;
    private _nomDeBase: string;
    private _nomId: string;

    /**
     * permet à la liste de créer ses items donc d'effectuer un reset
     * @param liste parent du gestionnaire
     * @param creeItemsInterface
     */
    constructor(liste: KfListe, creeItemsInterface: KfListeCreeItemsInterface) {
        this.liste = liste;
        this._creeItem = creeItemsInterface.creeItem;
        this.gereValeur = creeItemsInterface.gereValeur ? creeItemsInterface.gereValeur
            : (item: object): KfComposantGereValeur => item as KfComposantGereValeur;
        this._nomDeBase = creeItemsInterface.nomDeBase ? creeItemsInterface.nomDeBase
            : KfParametres.listeParDefaut.nomDeBase;
        if (creeItemsInterface.avecId) {
            this._nomId = creeItemsInterface.nomId ? creeItemsInterface.nomId
                : KfParametres.listeParDefaut.id;
        }
    }

    composant(item: object): KfComposant {
        return this.gereValeur(item).composant;
    }

    valeur(item: object): any {
        return this.gereValeur(item).valeur;
    }

    get avecIds(): boolean {
        return !!this._nomId;
    }

    id(item: object): number {
        if (this._nomId) {
            const valeur = this.gereValeur(item).valeur;
            if (valeur) {
                return valeur[this._nomId];
            }
        }
    }

    fixeId(item: object, id: number) {
        if (this._nomId) {
            const gereValeur = this.gereValeur(item);
            gereValeur.composant.nom = this._nomDeBase + id;
            const valeur = gereValeur.valeur;
            if (valeur) {
                valeur[this._nomId] = id;
                gereValeur.rétablit(valeur);
            }
        }
    }

    item(id: number): object {
        if (this._nomId) {
            return this.liste.items.find(item => this.id(item) === id);
        }
    }

    creeItem(): object {
        const item = this._creeItem();
        if (this._nomId) {
            this.fixeId(item, this.maxIdOccupé + 1);
        }
        return item;
    }

    /**
     * si les contenus sont des KfGroupes avec un membre id, retourne le maximum des ids, sinon 0
     */
    get maxIdOccupé(): number {
        let dernierIdOccupé = 0;
        if (this.liste.valeur) {
            this.liste.items.forEach(
                o => {
                    const id: number = this.id(o);
                    if (id && id > dernierIdOccupé) {
                        dernierIdOccupé = id;
                    }
                }
            );
        }
        return dernierIdOccupé;
    }

    recréeItems(valeurs: any[]): object[] {
        return valeurs.map(
            valeur => {
                const item: object = this.creeItem();
                this.gereValeur(item).rétablit(valeur);
                return item;
            }
        );
    }

    get debugIds(): any {
        const ids: number[] = this.liste.items.map(item => this.id(item));
        const idsValeurListe: number[] = this.liste.valeur.map(valeur => valeur[this._nomId]);
        return JSON.stringify({
            items: ids,
            gvValeur: idsValeurListe,
            vEgalc: this.liste.valeur === this.liste.formArray.value,
        });
    }

}
