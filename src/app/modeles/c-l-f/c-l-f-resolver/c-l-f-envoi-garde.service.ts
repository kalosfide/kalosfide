import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLFService } from '../c-l-f.service';
import { CLFResolverService } from './c-l-f-resolver.service';

@Injectable()
/**
 * Redirige vers la page ./bons si la synthèse n'est pas prête.
 */
export class CLFEnvoiGardeService extends CLFResolverService implements CanActivate {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const clfDocs = this.service.litStock();
        clfDocs.créeBilan();
        if (clfDocs.clfBilan.nbAPréparer > clfDocs.clfBilan.nbPréparés) {
            this.service.utile.url.fixeRouteBase(this.type);
            this.service.routeur.navigueUrlDef(this.service.utile.url.bons(clfDocs.client));
            return false;
        }
        return true;
    }
}
