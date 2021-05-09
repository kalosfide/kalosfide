import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { ClientCLFService } from '../client-c-l-f.service';
import { CLFLigneResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-ligne-resolver.service';

@Injectable()
export class CommandeLigneResolverService extends CLFLigneResolverService implements Resolve<CLFLigne> {

    type: TypeCLF = 'commande';

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
    }
}
