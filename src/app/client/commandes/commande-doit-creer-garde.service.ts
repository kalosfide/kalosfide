import { CLFGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-garde.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ClientCLFService } from '../client-c-l-f.service';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Redirige vers la page .nouveau si la commande éditable n'existe pas ou n'est pas ouverte.
 */
export class CommandeDoitCréerGardeService extends CLFGardeService implements CanActivate, CanActivateChild {

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
        this.nom = 'CommandeDoitCréerGardeService';
        this.nomResolver = 'CommandeBonResolverService';
        this.gardes = [
            {
                condition: this.commandeNExistePasOuEstEnvoyée.bind(this),
                redirection: service.utile.url.lignes.bind(service.utile.url)
            }
        ];
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
