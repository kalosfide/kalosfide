import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ApiRequêteAction } from "src/app/api/api-requete-action";
import { ApiResult } from "src/app/api/api-results/api-result";
import { Catalogue } from "src/app/modeles/catalogue/catalogue";
import { CatalogueService } from "src/app/modeles/catalogue/catalogue.service";
import { IdEtatSite } from "src/app/modeles/etat-site";
import { CatalogueComponent } from "./catalogue.component";

@Injectable()
export class CatalogueFinitService implements CanDeactivate<CatalogueComponent> {
    constructor(private service: CatalogueService) { }

    canDeactivate(
        component: CatalogueComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): boolean | Observable<boolean> {
        const site = component.site;
        // on n'arrête pas la modification si elle n'est pas en cours
        if (site.etat !== IdEtatSite.catalogue) {
            return true;
        }
        const catalogue: Catalogue = this.service.litStock();
        // on n'arrête pas la modification si le catalogue est vide
        if (catalogue.produits.length > 0) {
            return true;
        }
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