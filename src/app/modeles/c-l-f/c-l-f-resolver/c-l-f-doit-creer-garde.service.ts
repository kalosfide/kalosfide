import { CLFGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-garde.service';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLFService } from '../c-l-f.service';

@Injectable()
/**
 * Redirige vers la page .nouveau si la commande éditable n'existe pas ou n'est pas ouverte.
 */
export class CLFDoitCréerGardeService extends CLFGardeService {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
        this.nom = 'DoitCréerGardeService';
        this.nomResolver = 'BonResolverService';
        this.gardes = [
            {
                condition: this.bonEstVirtuelEtNExistePasOuEstEnvoyé.bind(this),
                redirection: this.service.utile.url.lignes.bind(this.service.utile.url)
            }
        ];
    }
}
