import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ApiRequêteAction } from "src/app/api/api-requete-action";
import { ApiResult } from "src/app/api/api-results/api-result";
import { CatalogueService } from "src/app/modeles/catalogue/catalogue.service";
import { CatalogueComponent } from "./catalogue.component";

@Injectable()
export class CatalogueCommenceService implements CanActivate {
    constructor(private service: CatalogueService) { }
    canActivate(
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
    ): Observable<boolean> {
        const site = this.service.navigation.litSiteEnCours();
        const apiRequête: ApiRequêteAction = {
            demandeApi: (): Observable<ApiResult> => {
                return this.service.commenceModification(site);
            },
            actionSiOk: (): void => {
                this.service.commenceModificationOk(site);
            },
        };

        return this.service.actionObs(apiRequête);
    }
}