import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IdEtatSite } from '../modeles/etat-site';
import { SiteService } from '../modeles/site/site.service';
import { Observable } from 'rxjs';

@Injectable()
export class SiteEtatResolverService implements Resolve<IdEtatSite> {

    constructor(
        protected service: SiteService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IdEtatSite> {
        return this.service.vérifieEtat();
    }
}
