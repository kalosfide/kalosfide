import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ClientCLFService } from "./client-c-l-f.service";

/**
 * Lit l'état du site en cours dans la bdd et si changé, met à jour les stockages du site
 * et si le site a fermé, vide le stockage du catalogue et met un contexte dans le stockage des docs
 * et si le site a réouvert, affiche une fenêtre modale  d'information.
 * Laisse passer.
 */
 @Injectable({
    providedIn: 'root',
})
export class LitEtatSiteEtLaissePasserGardeService implements CanActivate {

    constructor(
        private service: ClientCLFService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.service.litEtatSiteEtRetourneTrue();
    }
}
