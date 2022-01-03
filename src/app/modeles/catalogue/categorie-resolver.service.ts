import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { Categorie } from './categorie';
import { RouteurService } from 'src/app/services/routeur.service';
import { CategorieService } from './categorie.service';
import { mergeMap } from 'rxjs/operators';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { DataResolverService } from 'src/app/services/data-resolver.service';

@Injectable({
    providedIn: 'root'
})
export class CategorieResolverService extends DataResolverService implements Resolve<Categorie> {

    constructor(
        private routeur: RouteurService,
        private service: CategorieService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Categorie | Observable<Categorie> {
        const id: number = +route.paramMap.get('id');
        return this.service.catégorie$(id).pipe(
            mergeMap(catégorie => {
                if (catégorie) {
                    return of(catégorie);
                } else {
                    this.service.routeur.navigueVersPageErreur(new ApiResult404NotFound());
                    return EMPTY;
                }
            })
        );
    }

}
