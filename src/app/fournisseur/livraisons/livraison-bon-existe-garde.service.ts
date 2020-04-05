import { CanActivate, CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFBonExisteGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-bon-existe-garde.service';

@Injectable()
/**
 * Redirige vers la page .nouveau si la commande éditable n'existe pas ou n'est pas ouverte.
 */
export class LivraisonBonExisteGardeService extends CLFBonExisteGardeService implements CanActivate, CanActivateChild {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
