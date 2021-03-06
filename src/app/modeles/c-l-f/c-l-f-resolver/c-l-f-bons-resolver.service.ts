import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-resolver.service';
import { CLFService } from '../c-l-f.service';

export class CLFBonsResolverService extends CLFResolverService implements Resolve<CLFDocs> {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | CLFDocs | Observable<CLFDocs> {
        return this.service.litStock();
    }
}
