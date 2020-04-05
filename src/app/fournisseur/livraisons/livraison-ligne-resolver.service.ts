import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { CLFLigneResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-ligne-resolver.service';

@Injectable()
export class LivraisonLigneResolverService extends CLFLigneResolverService implements Resolve<CLFLigne> {

    type: TypeCLF = 'livraison';

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
