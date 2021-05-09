import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CompteService } from '../compte/compte.service';
import { ApiResult403Forbidden } from '../api/api-results/api-result-403-forbidden';

@Injectable({
    providedIn: 'root',
})
export class IdentifiantGardeService implements CanActivate, CanActivateChild {

    constructor(
        private compte: CompteService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this.compte.identification.estIdentifié) {
            return this.compte.sessionPasTerminée();
        }
        this.compte.routeur.navigueVersPageErreur(new ApiResult403Forbidden());
        return false;
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }
}
