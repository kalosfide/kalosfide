import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';


@Injectable()
export class ClientInviteParentResolverService implements Resolve<string> {

    constructor(
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | string | Observable<string> {
        const retour = route.queryParamMap.get('retour');
        if (!retour) {
            return EMPTY;
        }
        return retour;
    }

}
