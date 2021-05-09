import { Injectable } from '@angular/core';
import { DataResolverService } from '../services/data-resolver.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class QueryParamEmailPossibleResolverService extends DataResolverService implements Resolve<string> {

    constructor(
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
        const email = route.queryParamMap.get('email');
        return email;
    }

}
