import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Categorie } from './categorie';
import { CategorieService } from './categorie.service';
import { DataResolverService } from 'src/app/services/data-resolver.service';

@Injectable()
export class CategoriesResolverService extends DataResolverService implements Resolve<Categorie[]> {

    constructor(
        private service: CategorieService,
    ) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Categorie[] | Observable<Categorie[]> {
        return this.service.catégories$();
    }
}
