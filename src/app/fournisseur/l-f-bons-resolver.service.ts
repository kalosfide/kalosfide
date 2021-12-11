import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';

@Injectable()
export class LFBonsResolverService implements Resolve<CLFDocs> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | CLFDocs | Observable<CLFDocs> {
        const clfDocs = this.service.litStockSiExistant();
        if (!clfDocs) {
            throw new Error(`LFBonsResolverService: Pas de clfDocs en stock (${state.url})`);
        }
        return clfDocs;
    }
}
