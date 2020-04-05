import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Categorie } from './categorie';
import { RouteurService } from 'src/app/services/routeur.service';
import { CategorieService } from './categorie.service';
import { DataKeyResolverService } from 'src/app/commun/data-par-key/data-key-resolver.service';

@Injectable()
export class CategoriesResolverService extends DataKeyResolverService<Categorie> implements Resolve<Categorie[]> {

    constructor(
        private router: RouteurService,
        protected service: CategorieService,
    ) {
        super(service);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Categorie[] | Observable<Categorie[]> {
        return this.service.avecAttente(
            () => this.service.catégories$()
        )(route, state);
    }
}
