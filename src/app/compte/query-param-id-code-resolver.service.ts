import { IdCodeModel } from './id-code.model';
import { Injectable } from '@angular/core';
import { DataResolverService } from '../services/data-resolver.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteurService } from '../services/routeur.service';
import { ApiResult404NotFound } from '../api/api-results/api-result-404-not-found';

@Injectable()
export class QueryParamIdCodeResolverService extends DataResolverService implements Resolve<IdCodeModel> {

    constructor(
        private routeur: RouteurService
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IdCodeModel {
        const id = route.queryParamMap.get('id');
        const code = route.queryParamMap.get('code');
        if (!id || !code) {
            this.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return null;
        }
        return {
            id,
            code
        };
    }

}
