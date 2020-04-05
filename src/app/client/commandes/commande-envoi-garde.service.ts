import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ClientCLFService } from '../client-c-l-f.service';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Redirige vers la page .lignes si la commande n'est pas prête à l'envoi.
 */
export class CommandeEnvoiGardeService implements CanActivate {

    constructor(
        protected service: ClientCLFService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const gardé = this.service.gardeEnvoi();
        if (!gardé) {
            this.service.utile.url.fixeRouteCommande();
            this.service.routeur.navigueUrlDef(this.service.utile.url.lignes());
        }
        return gardé;
    }
}
