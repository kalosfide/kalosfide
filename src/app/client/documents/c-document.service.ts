import { Injectable } from '@angular/core';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { ClientService } from 'src/app/modeles/client/client.service';
import { CLFLectureService } from 'src/app/modeles/c-l-f/c-l-f-lecture.service';
import { ApiController } from 'src/app/commun/api-route';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';

@Injectable()
export class CDocumentService extends CLFLectureService {
    controllerUrl = ApiController.document;

    constructor(
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(catalogueService, stockageService, clientService, apiRequeteService);
    }
}
