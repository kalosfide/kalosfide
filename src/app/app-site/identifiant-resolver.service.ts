import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Identifiant } from '../securite/identifiant';
import { IdentificationService } from '../securite/identification.service';

@Injectable()
export class IdentifiantResolverService implements Resolve<Identifiant> {

    constructor(
        private identification: IdentificationService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Identifiant | Observable<never> | Observable<Identifiant> {
        return this.identification.litIdentifiant();
    }

}
