import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/** retourne true */
@Injectable()
export class RetourneVraiResolverService implements Resolve<boolean> {

    constructor(
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return true;
    }
}
