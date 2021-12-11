import { Observable, Subject, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class ValeurEtObservable<T> {
    private pValeur: T;
    private pSubject: Subject<T>;
    private pObservable: Observable<T>;

    nom: string;

    private constructor(valeurInitiale: T) {
        this.pValeur = valeurInitiale;
    }

    /**
     * crée un ValeurEtObservable dont l'observable émettra la valeur chaque fois qu'elle change
     * @param valeur valeur initiale
     * @param observable si absent, un Subject est créé pour l'observable
     */
    static nouveau<V>(valeur: V, observable?: Observable<V>): ValeurEtObservable<V> {
        const vEtO = new ValeurEtObservable<V>(valeur);
        if (observable) {
            vEtO.pObservable = observable;
        } else {
            vEtO.pSubject = new Subject<V>();
            vEtO.pObservable = vEtO.pSubject.asObservable();
        }
        return vEtO;
    }

    /**
     * Crée un ValeurEtObservable<V2> dont la valeur et l'observable sont les transformés de ceux d'un ValeurEtObservable<V1>.
     * L'observable du transformé n'emet pas si la valeur transformée est nulle ou indéfinie ou égale à sa valeur.
     * @param àTransformer ValeurEtObservable<V1> à transformer
     * @param transforme transformation de V1 en V2
     */
    static transforme<V1, V2>(àTransformer: ValeurEtObservable<V1>, transforme: (v: V1) => V2): ValeurEtObservable<V2> {
        const vEtO = new ValeurEtObservable<V2>(transforme(àTransformer.valeur));
        vEtO.pObservable = àTransformer.observable.pipe(
            filter((v1: V1) => {
                const v2 = transforme(v1);
                if (v2 === null || v2 === undefined) {
                    return false;
                }
                if (v2 === vEtO.valeur) {
                    return false;
                } else {
                    vEtO.pValeur = v2;
                    return true;
                }
            }),
            map((v1: V1) => {
                return vEtO.pValeur;
            }));
        return vEtO;
    }

    static et(vEtO1: ValeurEtObservable<boolean>, vEtO2: ValeurEtObservable<boolean>): ValeurEtObservable<boolean> {
        const vEtO = new ValeurEtObservable<boolean>(vEtO1.pValeur && vEtO2.pValeur);
        vEtO.pObservable = merge(vEtO1.pObservable, vEtO2.pObservable).pipe(
            map(v => {
                vEtO.pValeur = vEtO1.pValeur && vEtO2.pValeur;
                return vEtO.pValeur;
            })
        );
        return vEtO;
    }

    static ou(vEtO1: ValeurEtObservable<boolean>, vEtO2: ValeurEtObservable<boolean>): ValeurEtObservable<boolean> {
        const vEtO = new ValeurEtObservable<boolean>(vEtO1.pValeur || vEtO2.pValeur);
        vEtO.pObservable = merge(vEtO1.pObservable, vEtO2.pObservable).pipe(
            map(v => {
                vEtO.pValeur = vEtO1.pValeur || vEtO2.pValeur;
                return vEtO.pValeur;
            })
        );
        return vEtO;
    }

    static non(vEtO: ValeurEtObservable<boolean>): ValeurEtObservable<boolean> {
        const vEtO1 = new ValeurEtObservable<boolean>(!vEtO.pValeur);
        vEtO1.pObservable = vEtO.pObservable.pipe(
            map(v => {
                vEtO.pValeur = !v;
                return !v;
            })
        );
        return vEtO1;
    }

    get valeur(): T {
        return this.pValeur;
    }

    get observable(): Observable<T> {
        return this.pObservable;
    }

    /**
     * change la valeur stockée et si le ValeurEtObservable n'est pas un tranformé, emet la valeur
     * @param valeur nouvelle valeur
     */
    changeValeur(valeur: T) {
        this.pValeur = valeur;
        if (this.pSubject) {
            this.pSubject.next(valeur);
        }
    }

    /**
     * fixe la valeur sans toucher à l'observable
     * @param valeur nouvelle valeur
     */
    changeValeurSansEmettre(valeur: T) {
        this.pValeur = valeur;
    }
}

