import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { CLFResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-resolver.service';
import { switchMap } from 'rxjs/operators';
import { CLFService } from '../c-l-f.service';

export class CLFSynthèseResolverService extends CLFResolverService implements Resolve<CLFDoc> {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CLFDoc | Observable<CLFDoc> {
        return this.service.bons().pipe(
            switchMap(clfDocs => {
                const clfDoc = clfDocs.créeDocumentAEnvoyer();
                return of(clfDoc);
            })
        );
    }
}
