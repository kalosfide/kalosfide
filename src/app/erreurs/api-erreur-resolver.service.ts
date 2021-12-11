import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ApiResult404NotFound } from '../api/api-results/api-result-404-not-found';
import { ApiResultErreur } from '../api/api-results/api-result-erreur';
import { RouteurService } from '../services/routeur.service';

@Injectable({
    providedIn: 'root'
})
export class ApiErreurResolverService implements Resolve<ApiResultErreur> {
    constructor(private routeur: RouteurService) {}

    resolve(): ApiResultErreur {
    /**
     * Erreur stockée quand le routeur navigue vers une page erreur
     * ou quand le routeur retourne un UrlTree d'une page erreur à une garde
     */
     let apiErreur = this.routeur.apiErreur;
        if (!apiErreur) {
            // la navigation vers la page d'erreur n'a pas été déclenchée par le routeur ou une garde
            // c'est l'Angular Router qui n'a pas reconnu la route
            apiErreur = new ApiResult404NotFound(`l'Angular Router n'a pas reconnu la route`);
        }
        return apiErreur;
    }
}
