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
        let apiErreur = this.routeur.apiErreur;
        if (!apiErreur) {
            apiErreur = new ApiResult404NotFound();
        }
        return apiErreur;
    }
}
