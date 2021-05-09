import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CLFGardeService } from './c-l-f-garde.service';
import { CLFService } from '../c-l-f.service';

@Injectable()
/**
 * Redirige vers la page des lignes si le document n'est pas le bon virtuel.
 * Redirige vers la page de création si le document n'est pas le bon virtuel ouvert.
 * Garde les pages d'édition autres que lignes.
 */
export class CLFBonVirtuelGardeService extends CLFGardeService implements CanActivate {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
        this.nom = 'BonVirtuelGardeService';
        this.nomResolver = 'BonResolverService';
        this.gardes = [
            {
                condition: this.commandeEstVirtuelle.bind(this),
                redirection: this.service.utile.url.lignes.bind(this.service.utile.url)
            },
            {
                condition: this.commandeEstVirtuelleEtOuverte.bind(this),
                redirection: this.service.utile.url.nouveau.bind(this.service.utile.url)
            },
        ];
    }
}
