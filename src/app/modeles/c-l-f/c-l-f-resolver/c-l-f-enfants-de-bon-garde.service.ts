import { CLFService } from '../c-l-f.service';
import { ActivatedRouteSnapshot, ParamMap, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CLFDoc } from '../c-l-f-doc';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { CLFPages } from '../c-l-f-pages';
import { CLFDocs } from '../c-l-f-docs';
import { ApiResult404NotFound } from 'src/app/api/api-results/api-result-404-not-found';
import { CLFLitTypeDansRoute } from './c-l-f-lit-type-dans-route';

export class CLFEnfantsDeBonGarde {
    condition: () => boolean;
    redirection: string;
}

export class CLFEnfantsDeBonGardesDef {
    gardes: CLFEnfantsDeBonGarde[];
    avecNoLigne?: boolean;
}

export abstract class CLFEnfantsDeBonGardeService extends CLFLitTypeDansRoute {
    erreur: (message: string) => void;

    protected clfDoc: CLFDoc;
    protected noLigne: number;

    private dernièreRedirection: string;

    constructor(
        protected service: CLFService
    ) {
        super();
    }

    private redirige(redirection: string): IUrlDef {
        if (redirection === CLFPages.nouveau.path) {
            return this.service.utile.url.nouveau(this.clfDoc);
        }
        if (redirection === CLFPages.lignes.path) {
            return this.service.utile.url.lignes(this.clfDoc);
        }
        this.erreur('redirection')
    }

    protected get lignePasDansBon(): CLFEnfantsDeBonGarde {
        return {
            condition: () => this.clfDoc.lignePasDansBon(this.noLigne),
            redirection: CLFPages.lignes.path
        }
    }

    /**
     * Crée la liste des conditions-redirections et détermine s'il faut traiter le no de ligne.
     * @param path de la route à garder
     */
     protected abstract créeGardes(path: string): CLFEnfantsDeBonGardesDef;
    /**
     * Crée le bon et éventuellement fixe le no de la ligne.
     * @param clfDocs lu dans le stock
     * @param paramMap de la route à garder
     * @returns false si les paramètres sont incorrects
     */
    protected abstract créeBon(clfDocs: CLFDocs, paramMap: ParamMap, avecNoLigne?: boolean): boolean;

    /**
     * Lit le path de la route dans son routeConfig.
     * Si le path correspond à la dernière redirection, laisse passer.
     * Sinon crée la liste des conditions-redirections nécessaires pour garder la route
     * Crée le bon et éventuellement fixe le no de la ligne à partir du clfDocs stocké et des paramétres de la route.
     * Applique chaque condition au bon créé et redirige si la condition n'est pas satisfaite.
     * @param route route à garder
     */
    garde(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        // Fonction à appeler lorsque se produit une erreur à déboguer
        this.erreur = (message: string) => {
            throw new Error(`CLFEnfantsDeBonGarde: ${message} (${state.url})`)
        }

        // Lit le path dans le routeConfig de la route
        const path = route.routeConfig.path;

        if (this.dernièreRedirection) {
            // le dernier appel à la garde a redirigé vers le path actuel
            if (this.dernièreRedirection === path) {
                // pas besoin de tester la route
                this.dernièreRedirection = undefined;
                return true;
            }
            this.erreur('dernièreRedirection: ' + this.dernièreRedirection);
        }

        // Définitions des gardes en fonction du path différentes pour le client et le fournisseur
        const def = this.créeGardes(path);

        // Lit le stock
        const clfDocs = this.service.litStockSiExistant();
        if (!clfDocs) {
            this.erreur(`Pas de clfDocs en stock`);
        }

        // Crée le bon et éventuellement la ligne à tester
        if (!this.créeBon(clfDocs, route.paramMap, def.avecNoLigne)) {
            // les paramètres sont incorrects
            return this.service.routeur.urlTreeErreur(new ApiResult404NotFound());
        }

        for (const garde of def.gardes) {
            if (!garde.condition()) {
                this.dernièreRedirection = garde.redirection;
                return this.service.routeur.urlTreeUrlDef(this.redirige(garde.redirection));
            }
        }
        this.dernièreRedirection = undefined;
        return true;
    }

}
