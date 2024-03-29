import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValeurEtObservable } from '../commun/outils/valeur-et-observable';

export class Attente {
    /**
     * pour débogage
     */
    nom: string;
    /**
     * Date.now() du début de l'attente
     */
    début: number;
    /**
     * Enregistrement du début par le service
     */
    private serviceCommence: () => void;
    /**
     * Enregistrement de la fin par le service
     */
    serviceFinit: () => void;
    
    constructor(serviceCommence: (attente: Attente, délai?: number) => void, serviceFinit: (attente: Attente) => void, délai?: number) {
        this.serviceCommence = () => serviceCommence(this, délai);
        this.serviceFinit = () => serviceFinit(this);
    }
    
    commence() {
        this.début = Date.now();
        this.serviceCommence();
    }
    finit() {
        this.serviceFinit();
    }
    toString(): string {
        return `${this.nom} (${new Date(this.début)})`;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AttenteService {
    private enCoursIO: ValeurEtObservable<boolean>;

    /**
     * Array des Date.now() au commencement des attentes
     */
    private attentes: Attente[];

    /**
     * identifiant du window.Timeout utilisé
     */
    private IdTimeOut: number;

    /**
     * durée de vie du TimeOut en ms
     */
    private délai: number;

    constructor() {
        this.enCoursIO = ValeurEtObservable.nouveau(false);
        this.délai = 2;
        this.initialise();
    }

    /**
     * Observable qui émet true quand l'attente commence et false quand elle finit auquel souscrit le component qui affiche l'attente
     */
    enCours(): Observable<boolean> {
        return this.enCoursIO.observable;
    }

    private initialise() {
        this.attentes = [];
    }

    private get debugs(): string[] {
        return this.attentes.map(a => a.toString());
    }

    // le timeOut sert à ce que l'affichage ne commence pas si l'action est de courte durée
    private créeTimeOut(délai?: number) {
        if (this.IdTimeOut) {
            // il y a déjà un timeOut
            throw new Error('créeTimeOut');
        }
        if (délai === undefined) {
            délai = this.délai;
        }

        if (délai > 0) {
            // specify window.setTimeout to side-step conflict with node types: https://github.com/mgechev/angular2-seed/issues/901
            this.IdTimeOut = window.setTimeout(() => this.quandDélaiTerminé(), this.délai);
        } else {
            this.enCoursIO.changeValeur(true);
        }
    }

    private détruitTimeOut() {
        clearTimeout(this.IdTimeOut);
        this.IdTimeOut = undefined;
    }

    private quandDélaiTerminé() {
        this.détruitTimeOut();
        this.enCoursIO.changeValeur(true);
    }

    /**
     * Commence une attente. Retourne le Date.now() du commencement
     * @param nom nom de l'attente pour le débogage
     */
    attente(nom: string, délai?: number): Attente {
        const attente = new Attente(this.commence.bind(this), this.finit.bind(this), délai);
        attente.nom = nom;
        return attente;
    }

    /**
     * Commence une attente.
     */
    private commence(attente: Attente, délai?: number) {
        this.attentes.push(attente);
        if (this.attentes.length === 1) {
            this.créeTimeOut();
        }
        return attente;
    }

    /**
     * Finit une attente.
     */
    private finit(attente: Attente) {
        // finit l'attente
        const index = this.attentes.findIndex(id => id.début === attente.début);
        if (index === -1) {
            throw new Error(`AttenteService: id d'attente à terminer invalide`);
        }
        this.attentes.splice(index, 1);

        // s'il n'y a plus d'attente en cours, réinitialise et termine l'affichage
        if (this.attentes.length === 0) {
            if (this.IdTimeOut) {
                this.détruitTimeOut();
            }
            this.initialise();
            this.enCoursIO.changeValeur(false);
        }
    }

}
