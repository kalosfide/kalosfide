import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { Categorie } from './categorie';
import { RouteurService } from 'src/app/services/routeur.service';
import { CategorieService } from './categorie.service';
import { mergeMap } from 'rxjs/operators';
import { ApiResult404NotFound } from 'src/app/commun/api-results/api-result-404-not-found';
import { DataKeyResolverService } from 'src/app/commun/data-par-key/data-key-resolver.service';

@Injectable()
export class CategorieResolverService extends DataKeyResolverService<Categorie> implements Resolve<Categorie> {

    constructor(
        private routeur: RouteurService,
        protected service: CategorieService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Categorie | Observable<Categorie> {
        const no: number = +route.paramMap.get('no');
        return this.service.catégorie$(no).pipe(
            mergeMap(catégorie => {
                if (catégorie) {
                    return of(catégorie);
                } else {
                    this.routeur.navigueVersErreur(new ApiResult404NotFound());
                    return EMPTY;
                }
            })
        );
    }

}
