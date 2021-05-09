import { Injectable } from '@angular/core';
import { DataResolverService } from '../services/data-resolver.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiResult404NotFound } from '../api/api-results/api-result-404-not-found';
import { RouteurService } from '../services/routeur.service';

@Injectable()
export class QueryParamEmailRequisResolverService extends DataResolverService implements Resolve<string> {

    constructor(
        private routeur: RouteurService
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
        const email = route.queryParamMap.get('email');
        if (!email) {
            this.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return null;
        }
        return email;
    }

}
