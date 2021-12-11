import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProduitPages } from './produit-pages';
import { RouteurService } from '../../../services/routeur.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

@Injectable({
    providedIn: 'root',
})
/**
 * redirige vers l'index des produits si le site n'est pas d'état catalogue
 */
export class ProduitSitePasCatalogueGarde implements CanActivate {

    constructor(
        private routeur: RouteurService,
        private identification: IdentificationService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const site = this.identification.siteEnCours;
        if (site.ouvert) {
            this.routeur.naviguePageDef(ProduitPages.index, Fabrique.url.appRouteur.produit);
            return false;
        }
        return true;
    }
}
