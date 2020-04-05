import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from 'src/app/modeles/site/site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';

@Injectable()
export class SitesResolverService extends DataResolverService implements Resolve<Site[]> {

    constructor(
        private service: SiteService,
    ) {
        super();
    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Site[]> {
        return this.service.objet<Site[]>(this.service.liste());
    }

}
