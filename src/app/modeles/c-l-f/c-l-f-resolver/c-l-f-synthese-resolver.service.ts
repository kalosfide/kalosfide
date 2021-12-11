import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { CLFService } from '../c-l-f.service';

export class CLFSynthèseResolverService implements Resolve<CLFDoc> {

    constructor(
        protected service: CLFService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CLFDoc | Observable<CLFDoc> {
        return CLFDoc.synthèse(this.service.litStock());
    }
}
