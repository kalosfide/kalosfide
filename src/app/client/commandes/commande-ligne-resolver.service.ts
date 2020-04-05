import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { CLFResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-resolver.service';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { ClientCLFService } from '../client-c-l-f.service';

@Injectable()
export class CommandeLigneResolverService extends CLFResolverService implements Resolve<CLFLigne> {

    type: TypeCLF = 'commande';

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | CLFLigne | Observable<CLFLigne> {
        return this.ligneParNoProduit(route);
    }
}
