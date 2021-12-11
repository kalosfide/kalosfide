import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { SiteService } from "../modeles/site/site.service";
import { ClientPages } from "../client/client-pages";
import { Fabrique } from "../disposition/fabrique/fabrique";
import { ApiResultErreurSpéciale } from "../api/api-results/api-result-erreur";
import { map } from "rxjs/operators";
import { Role } from "../modeles/role/role";

/**
 * Lit dans le stock l'état du site et, si le site est fermé, redirige vers la page pasOuvert pour un client
 * ou, pour un fournisseur, ouvre une fenêtre modale et annule la navigation sans rediriger.
 */
@Injectable({
    providedIn: 'root',
})
export class SiteOuvertGardeService implements CanActivate {

    constructor(
        private service: SiteService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        const role = this.service.identification.roleEnCours;
        if (role.site.ouvert) {
            return true;
        }
        if (role.estClient) {
            return this.service.routeur.urlTreePageDef(ClientPages.pasOuvert, Fabrique.url.appRouteur.client);
        }
        const modal = Fabrique.erreurModal(new ApiResultErreurSpéciale(409,
            'Action impossible',
            `Une modification du catalogue est en cours.`,
        ));
        return this.service.modalService.confirme(modal).pipe(
            map(() => false)
        );
    }
}
