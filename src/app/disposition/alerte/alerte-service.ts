import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Alerte } from './alerte';

@Injectable({
    providedIn: 'root'
})
export class AlerteService {
    private _alertesSubject = new Subject<boolean>();
    private _alertes: Alerte[] = [];

    constructor(router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this._alertes = this._alertes.filter(alerte => {
                    if (alerte.nbNavigationAvantFermeture) {
                        alerte.nbNavigationAvantFermeture--;
                        if (alerte.nbNavigationAvantFermeture <= 0) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        });
    }

    get alertes(): Alerte[] {
        return this._alertes;
    }

    set alertes(alertes: Alerte[]) {
        this._alertes = [];
        alertes.forEach(alerte => this._ajoute(alerte));
        this._alertesSubject.next(true);
    }

    private _ajoute(alerte: Alerte) {
        this._alertes = this._alertes.filter(a => alerte.id !== a.id);
        this._alertes.push(alerte);
        if (alerte.fermetureAuto) {
            setTimeout(() => {
                this.supprime(alerte.id);
            }, alerte.fermetureAuto);
        }
    }

    ajoute(alerte: Alerte) {
        this._ajoute(alerte);
        this._alertesSubject.next(true);
    }

    supprime(alerteId: string) {
        this._alertes = this._alertes.filter(alerte => alerte.id !== alerteId);
        this._alertesSubject.next(true);
    }

    alertesChangé$(): Observable<boolean> {
        return this._alertesSubject.asObservable();
    }
}
