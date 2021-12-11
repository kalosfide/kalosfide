import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Site } from '../modeles/site/site';
import { SiteService } from '../modeles/site/site.service';

@Injectable()
export class SiteResolverService implements Resolve<Site> {

    constructor(
        private service: SiteService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Site {
        return this.service.litSiteEnCours();
    }
}
