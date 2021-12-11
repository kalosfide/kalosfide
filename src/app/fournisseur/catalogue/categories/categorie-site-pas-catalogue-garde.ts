import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IdentificationService } from 'src/app/securite/identification.service';
import { RouteurService } from 'src/app/services/routeur.service';
import { CategoriePages } from './categorie-pages';

@Injectable({
    providedIn: 'root',
})
/**
 * redirige vers l'index des catégories si le site n'est pas d'état catalogue
 */
export class CategorieSitePasCatalogueGarde implements CanActivate {

    constructor(
        private routeur: RouteurService,
        private identification: IdentificationService,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const site = this.identification.siteEnCours;
        if (site.ouvert) {
            return this.routeur.urlTreePageDef(CategoriePages.index, Fabrique.url.appRouteur.catégorie);
        }
        return true;
    }
}
