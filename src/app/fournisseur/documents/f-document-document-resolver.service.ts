import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { FDocumentResolverService } from './f-document-resolver.service';

@Injectable()
export class FDocumentDocumentResolverService extends FDocumentResolverService implements Resolve<CLFDoc> {

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFDoc> {
        return this.document(route);
    }
}
