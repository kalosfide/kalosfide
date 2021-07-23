import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFBonVirtuelGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-bon-virtuel-garde.service';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Redirige vers la page du bon virtuel si le document n'est pas le bon virtuel.
 * Garde les pages d'édition autres que lignes.
 */
export class FactureBonVirtuelGardeService extends CLFBonVirtuelGardeService implements CanActivate {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

    /**
     * Recherche KeyClient et noDoc dans les params de la route et de ses parents.
     * Redirige si le bon créé à partir de ces params ne satisfait pas la condition.
     * @param route route à garder
     */
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.peutActiver(route);
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.peutActiver(route);
    }
}
