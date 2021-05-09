import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ApiRequêteAction } from "src/app/api/api-requete-action";
import { ApiResult } from "src/app/api/api-results/api-result";
import { CatalogueService } from "src/app/modeles/catalogue/catalogue.service";
import { CatalogueComponent } from "./catalogue.component";

@Injectable()
export class CatalogueEditionService {
    private commenceEncours: boolean;

    constructor(private service: CatalogueService) { }

    commence(): Observable<boolean> {
        const site = this.service.navigation.litSiteEnCours();
        const apiRequête: ApiRequêteAction = {
            demandeApi: (): Observable<ApiResult> => {
                return this.service.commenceModification(site);
            },
            actionSiOk: (): void => {
                this.service.commenceModificationOk(site);
            },
        };

        this.commenceEncours = true;
        return this.service.actionObs(apiRequête).pipe(
            tap(() => this.commenceEncours = false)
        );
    }

    canDeactivate(
        component: CatalogueComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean> {
        const site = this.service.navigation.litSiteEnCours();
        const apiRequête: ApiRequêteAction = {
            formulaire: component.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.termineModification(site);
            },
            actionSiOk: (): void => {
                this.service.termineModificationOk(site);
            },
        };

        return this.service.actionObs(apiRequête);
    }
}