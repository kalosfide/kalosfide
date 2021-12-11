import { Injectable } from '@angular/core';
import { CanActivateChild, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResult403Forbidden } from '../api/api-results/api-result-403-forbidden';
import { IdentificationService } from '../securite/identification.service';
import { RouteurService } from '../services/routeur.service';

/**
 * Si l'utilisateur est identifié et s'il est client du site en cours du NavigationService, laisse passer. Sinon, redirige vers la page erreur 403.
 */
 @Injectable({
    providedIn: 'root',
})
export class ClientGardeService implements CanActivateChild {

    constructor(
        private identification: IdentificationService,
        private routeur: RouteurService
    ) {
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const role = this.identification.roleEnCours;
        if (role.estClient) {
            return true;
        }
        return this.routeur.urlTreeErreur403(new ApiResult403Forbidden());
    }
}
