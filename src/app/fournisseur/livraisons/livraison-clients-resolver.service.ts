import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFClientsResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-clients-resolver.service';

@Injectable()
export class LivraisonClientsResolverService extends CLFClientsResolverService implements Resolve<CLFDocs> {

    type: TypeCLF = 'livraison';

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
