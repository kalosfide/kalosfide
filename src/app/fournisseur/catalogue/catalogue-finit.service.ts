import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiRequêteAction } from "src/app/api/api-requete-action";
import { Catalogue } from "src/app/modeles/catalogue/catalogue";
import { CatalogueService } from "src/app/modeles/catalogue/catalogue.service";
import { CatalogueComponent } from "./catalogue.component";

/**
 * Termine la modification si le catalogue n'est pas vide.
 */
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
        // si la modification n'est pas en cours, on peut quitter la page du catalogue
        if (site.ouvert) {
            return true;
        }
        const catalogue: Catalogue = this.service.litStock();
        // si la modification est en cours et si le catalogue est vide, on ne peut pas arrêter la modification
        // mais on peut quitter la page du catalogue
        if (catalogue.produits.length === 0) {
            return true;
        }
        // si la modification est en cours et si le catalogue n'est pas vide, on demande à l'api de terminer la modification
        const apiRequête: ApiRequêteAction = this.service.termineModification(site);
        apiRequête.formulaire = component.superGroupe;
        return this.service.actionObs(apiRequête).pipe(
            map((ok: boolean) => {
                if (!ok) {
                    // l'api a retourné une erreur
                    // actionObs a affiché une fenêtre modale

                }
                return true;
            })
        );
    }
}