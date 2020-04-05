import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FormulaireAEtapeService } from './formulaire-a-etapes.service';
import { EtapeDeFormulaire } from './etape-de-formulaire';

@Injectable()
export class FormulaireAEtapeResolverService implements Resolve<EtapeDeFormulaire> {

    constructor(
        private _formulaireAEtapesService: FormulaireAEtapeService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): EtapeDeFormulaire | Observable<EtapeDeFormulaire> {
        const urlSegment = route.paramMap.get('etape');
        console.log(route, state);
        return this._formulaireAEtapesService.trouveEtape(urlSegment);
    }

}
