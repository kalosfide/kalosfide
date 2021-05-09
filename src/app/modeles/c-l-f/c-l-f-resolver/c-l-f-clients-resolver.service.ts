import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FournisseurCLFService } from 'src/app/fournisseur/fournisseur-c-l-f-.service';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-resolver.service';

export abstract class CLFClientsResolverService extends CLFResolverService implements Resolve<CLFDocs> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFDocs> {
        return this.service.clientsAvecRésumésBons(this.type);
    }
}
