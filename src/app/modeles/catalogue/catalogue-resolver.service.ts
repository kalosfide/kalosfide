import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Catalogue } from './catalogue';
import { CatalogueService } from './catalogue.service';

/**
 * Charge le catalogue ou le lit s'il est déjà dans le stock.
 */
@Injectable()
export class CatalogueResolverService implements Resolve<Catalogue> {

    constructor(
        private service: CatalogueService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Catalogue> {
        return this.service.catalogue$();
    }

}
