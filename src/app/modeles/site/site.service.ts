import { Injectable } from '@angular/core';
import { Site } from './site';
import { ApiController } from '../../api/api-route';
import { KeyUidRnoService } from '../../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { ApiRequêteService } from '../../api/api-requete.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';

@Injectable({
    providedIn: 'root'
})
export class SiteService extends KeyUidRnoService<Site> {

    controllerUrl = ApiController.site;

    constructor(
        protected stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(stockageService, apiRequeteService);
    }
}
