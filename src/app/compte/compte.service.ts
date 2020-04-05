import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';

import { ApiResult } from '../commun/api-results/api-result';
import { ConnectionModel } from './connection/connection.model';
import { tap } from 'rxjs/operators';
import { ApiController, ApiAction } from 'src/app/commun/api-route';
import { ApiRequêteService } from '../services/api-requete.service';
import { DevenirClientModel } from '../visiteur/devenir-client/devenir-client-model';
import { DevenirFournisseurModel } from '../app-site/devenir-fournisseur/devenir-fournisseur-model';

@Injectable({
    providedIn: 'root',
})
export class CompteService extends DataService {

    public controllerUrl = ApiController.utilisateur;

    constructor(
        protected apiRequeteService: ApiRequêteService
    ) {
        super(apiRequeteService);
    }

    public connecte(connectionModel: ConnectionModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.connecte, connectionModel);
    }

    public déconnecte(): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.deconnecte)
            .pipe(tap(() => {
                this.identification.déconnecte();
            }));
    }

    public enregistreClient(data: DevenirClientModel): Observable<ApiResult> {
        return this.post(ApiController.enregistrement, ApiAction.enregistrement.client, data);
    }

    public enregistreFournisseur(data: DevenirFournisseurModel): Observable<ApiResult> {
        return this.post(ApiController.enregistrement, ApiAction.enregistrement.fournisseur, data);
    }

}
