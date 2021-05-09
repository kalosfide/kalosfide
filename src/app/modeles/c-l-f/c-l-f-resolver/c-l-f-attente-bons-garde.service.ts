import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TypeCLF } from '../c-l-f-type';
import { CLFPages } from '../c-l-f-pages';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { Observable, EMPTY } from 'rxjs';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { map, catchError } from 'rxjs/operators';
import { FournisseurCLFService } from 'src/app/fournisseur/fournisseur-c-l-f-.service';

export class CLFAttenteBonsGardeService {
    type: TypeCLF;

    constructor(protected service: FournisseurCLFService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const paramKey = route.paramMap.get(CLFPages.nomParamKeyClient);
        if (paramKey) {
            const key = KeyUidRno.keyDeTexte(paramKey);
            return this.service.clientAvecBons(key, this.type).pipe(
                map(() => {
                    return true;
                }),
                catchError(err => {
                    console.error(err);
                    return EMPTY;
                })
            );
        } else {
            this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
            return false;
        }
    }

}
