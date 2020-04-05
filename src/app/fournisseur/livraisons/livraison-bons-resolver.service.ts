import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFBonsResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-bons-resolver.service';

@Injectable()
export class LivraisonBonsResolverService extends CLFBonsResolverService implements Resolve<CLFDocs> {

    type: TypeCLF = 'livraison';

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
