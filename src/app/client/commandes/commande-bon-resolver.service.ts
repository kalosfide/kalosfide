import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { ClientCLFService } from '../client-c-l-f.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';

@Injectable()
/**
 * retourne le CLFDocs
 */
export class CommandeBonResolverService extends DataResolverService implements Resolve<CLFDoc> {

    constructor(
        private service: ClientCLFService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CLFDoc | Observable<CLFDoc> {
        return this.service.résoudPageBon();
    }

}
