import { CLFGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-garde.service';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { ClientCLFService } from '../client-c-l-f.service';

@Injectable()
/**
 * Redirige vers la page .nouveau si la commande éditable n'existe pas ou n'est pas ouverte.
 */

export class CommandeBonExisteGardeService extends CLFGardeService implements CanActivate, CanActivateChild {

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
        this.nom = 'CommandeBonExisteGardeService';
        this.nomResolver = 'CommandeBonResolverService';
        this.gardes = [
            {
                condition: this.commandeExisteEtEstOuverte.bind(this),
                redirection: service.utile.url.nouveau.bind(service.utile.url)
            }
        ];
    }
}
