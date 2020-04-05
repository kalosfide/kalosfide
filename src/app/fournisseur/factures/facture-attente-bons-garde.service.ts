import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { CLFAttenteBonsGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-attente-bons-garde.service';

@Injectable()
/**
 * Bloque la route tant que le stock n'est pas chargé
 * Fixe le stock avec les bons à synthétiser du client
 */
export class FactureAttenteBonsGardeService extends CLFAttenteBonsGardeService implements CanActivate {

    type: TypeCLF = 'facture';

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
