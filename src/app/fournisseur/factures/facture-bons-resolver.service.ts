import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFBonsResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-bons-resolver.service';

@Injectable()
export class FactureBonsResolverService extends CLFBonsResolverService implements Resolve<CLFDocs> {

    type: TypeCLF = 'facture';

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
