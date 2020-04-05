import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFEnvoiGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-envoi-garde.service';

@Injectable()
/**
 * Redirige vers la page ./bons si la synthèse n'est pas prête.
 */
export class FactureEnvoiGardeService extends CLFEnvoiGardeService implements CanActivate {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
