import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Fournisseur } from 'src/app/modeles/fournisseur/fournisseur';
import { FournisseurService } from 'src/app/modeles/fournisseur/fournisseur.service';

/**
 * Résoud la liste des fournisseurs
 * .
 */
@Injectable()
export class FournisseursResolverService implements Resolve<Fournisseur[]> {

    constructor(
        private service: FournisseurService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Fournisseur[] | Observable<Fournisseur[]> {
        return this.service.liste();
    }

}
