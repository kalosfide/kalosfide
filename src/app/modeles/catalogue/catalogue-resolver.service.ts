import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Catalogue } from './catalogue';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { CatalogueService } from './catalogue.service';

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
