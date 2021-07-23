import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFDoitCréerGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-doit-creer-garde.service';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Redirige vers la page .nouveau si la commande éditable n'existe pas ou n'est pas ouverte.
 */
export class LivraisonDoitCréerGardeService extends CLFDoitCréerGardeService implements CanActivate, CanActivateChild {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.peutActiver(route);
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.peutActiver(route);
    }
}
