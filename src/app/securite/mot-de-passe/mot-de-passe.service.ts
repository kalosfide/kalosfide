import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { ReglesDeMotDePasse } from './mot-de-passe';
import { ApiRequêteService } from 'src/app/services/api-requete.service';

@Injectable()
export class MotDePasseService extends DataService {

    controllerUrl = ApiController.motdepasse;

    constructor(
        protected apiRequeteService: ApiRequêteService
    ) {
        super(apiRequeteService);
    }

    chargeRègles(): Observable<ReglesDeMotDePasse> {
        const apiResult$ = this.getSansParamsSansIdentification(ApiController.motdepasse, ApiAction.motdepasse.options);
        return  this.objet<ReglesDeMotDePasse>(apiResult$);
    }
}
