import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KfInitialObservable } from '../commun/kf-composants/kf-partages/kf-initial-observable';

@Injectable({
    providedIn: 'root'
})
export class AttenteService {
    private enCoursIO: KfInitialObservable<boolean>;

    private attentes: number[];
    private debugNos: string[];
    private nb: number;

    // identifiant du window.Timeout utilisé
    private IdTimeOut: number;

    // durée de vie du TimeOut en ms
    private délai: number;

    constructor() {
        this.enCoursIO = KfInitialObservable.nouveau(false);
        this.délai = 2;
        this.initialise();
    }

    enCours(): Observable<boolean> {
        return this.enCoursIO.observable;
    }

    private initialise() {
        this.attentes = [];
        this.nb = 0;
        this.debugNos = [];
    }

    private get debugs(): string[] {
        const d: string[] = [];
        for (let i = 0; i < this.attentes.length; i++) {
            d.push('' + this.attentes[i] + ' ' + this.debugNos[i]);
        }
        return d;
    }

    // le timeOut sert à ce que l'affichage ne commence pas si l'action est de courte durée
    private créeTimeOut() {
        if (this.IdTimeOut) {
            // il y a déjà un timeOut
            throw new Error('créeTimeOut');
        }

        // specify window.setTimeout to side-step conflict with node types: https://github.com/mgechev/angular2-seed/issues/901
        this.IdTimeOut = window.setTimeout(() => this.quandDélaiTerminé(), this.délai);
    }

    private détruitTimeOut() {
        clearTimeout(this.IdTimeOut);
        this.IdTimeOut = undefined;
    }

    private quandDélaiTerminé() {
//        console.log('délaiTerminé', this.attentes);
        this.détruitTimeOut();
        this.enCoursIO.changeValeur(true);
    }

    commence(debug?: string): number {
        const attente = ++this.nb;
        this.attentes.push(attente);
        debug = debug ? debug : 'sans nom';
        this.debugNos.push(debug);
//        console.log('commence', this.debugs);
        if (this.nb === 1) {
            this.créeTimeOut();
        }
        return attente;
    }

    finit(attente: number) {
        if (this.attentes.length === 1 && this.attentes[0] === attente) {
            if (this.IdTimeOut) {
                this.détruitTimeOut();
            }
            this.initialise();
//        console.log('finit et emet', attente, this.debugs);
            this.enCoursIO.changeValeur(false);
        } else {
            const index = this.attentes.findIndex(id => id === attente);
            if (index === -1) {
                throw new Error('AttenteService: id d\'attente à terminer invalide');
            }
            this.attentes.splice(index, 1);
            const debug = this.debugNos.splice(index, 1)[0];
//        console.log('finit', debug, this.debugs);
        }
    }

}
