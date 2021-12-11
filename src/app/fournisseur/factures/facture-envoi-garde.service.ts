import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { LFEnvoiGardeService } from 'src/app/fournisseur/l-f-envoi-garde.service';

@Injectable()
/**
 * Redirige vers la page ./bons si la synthèse n'est pas prête.
 */
export class FactureEnvoiGardeService extends LFEnvoiGardeService implements CanActivate {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
