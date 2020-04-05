import { CanActivate, CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFDoitCréerGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-doit-creer-garde.service';

@Injectable()
/**
 * Redirige vers la page .nouveau si la commande éditable n'existe pas ou n'est pas ouverte.
 */
export class FactureDoitCréerGardeService extends CLFDoitCréerGardeService implements CanActivate, CanActivateChild {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
