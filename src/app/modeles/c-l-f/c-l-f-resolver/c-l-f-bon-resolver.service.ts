import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { CLFResolverService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-resolver.service';
import { CLFPages } from '../c-l-f-pages';
import { switchMap } from 'rxjs/operators';
import { ApiResult404NotFound } from 'src/app/commun/api-results/api-result-404-not-found';
import { CLFService } from '../c-l-f.service';

export class CLFBonResolverService extends CLFResolverService implements Resolve<CLFDoc> {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | CLFDoc | Observable<CLFDoc> {
        const no = +route.paramMap.get(CLFPages.nomParamNoDoc);
        return this.service.bons().pipe(
            switchMap(clfDocs => {
                const clfDoc = clfDocs.créeBon(no);
                if (!clfDoc) {
                    this.service.routeur.navigueVersErreur(new ApiResult404NotFound());
                    return EMPTY;
                }
                return of(clfDoc);
            })
        );
    }
}
