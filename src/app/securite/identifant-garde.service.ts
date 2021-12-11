import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, UrlTree } from '@angular/router';
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

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        if (this.compte.identification.estIdentifié) {
            return this.compte.sessionPasTerminée();
        }
        return this.compte.routeur.urlTreeErreur403(new ApiResult403Forbidden());
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(childRoute, state);
    }
}
