import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CLFDocumentResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-document-resolver.service';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { ClientCLFService } from '../client-c-l-f.service';
import { Client } from 'src/app/modeles/client/client';

@Injectable()
export class CDocumentResolverService extends CLFDocumentResolverService implements Resolve<CLFDoc> {

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
    }

    client(): Client {
        const site = this.service.identification.siteEnCours;
        return site.client;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CLFDoc> {
        return this.document(route);
    }
}
