import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Identifiant } from './identifiant';
import { IdentificationService } from './identification.service';

@Injectable()
export class IdentifiantResolverService implements Resolve<Identifiant> {

    constructor(
        private _identification: IdentificationService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Identifiant | Observable<never> | Observable<Identifiant> {
        return this._identification.litIdentifiant();
    }

}
