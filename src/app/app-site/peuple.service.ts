import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ApiController, ApiAction } from 'src/app/api/api-route';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { ApiRequêteService } from '../api/api-requete.service';

export class Peuple {
    peuple: boolean;
}

@Injectable()
export class PeupleService extends DataService {

    controllerUrl = ApiController.peuple;

    constructor(
        protected apiRequeteService: ApiRequêteService
    ) {
        super(apiRequeteService);
    }

    estPeuplé(): Observable<ApiResult> {
        return this.get<Peuple>(ApiController.peuple, ApiAction.peuple.estPeuple, '');
    }

    peuple(): Observable<ApiResult> {
        const peuple: Peuple = { peuple: true };
        return this.post<Peuple>(ApiController.peuple, ApiAction.peuple.peuple, peuple);
    }
}
