import { Injectable } from '@angular/core';
import { Site } from './site';
import { ApiController } from '../../api/api-route';
import { KeyIdService } from '../../commun/data-par-key/key-id/key-id.service';
import { ApiRequêteService } from '../../api/api-requete.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';

@Injectable({
    providedIn: 'root'
})
export class SiteService extends KeyIdService<Site> {

    controllerUrl = ApiController.site;

    constructor(
        protected stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(stockageService, apiRequeteService);
    }
}
