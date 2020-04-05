import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFBonResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-bon-resolver.service';

@Injectable()
export class FactureBonResolverService extends CLFBonResolverService implements Resolve<CLFDoc> {

    type: TypeCLF = 'facture';

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
