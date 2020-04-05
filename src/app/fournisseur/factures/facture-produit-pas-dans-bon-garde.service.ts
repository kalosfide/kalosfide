import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFProduitPasDansBonGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-produit-pas-dans-bon-garde.service';

@Injectable()
/**
 * Redirige vers la page .lignes si le produit de la ligne est déjà dans le bon.
 * Garde la page d'ajout d'une ligne.
 */
export class FactureProduitPasDansBonGardeService extends CLFProduitPasDansBonGardeService implements CanActivate {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
