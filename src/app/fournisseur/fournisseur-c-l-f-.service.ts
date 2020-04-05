import { Injectable } from '@angular/core';
import { ApiController } from 'src/app/commun/api-route';
import { CatalogueService } from 'src/app/modeles/catalogue/catalogue.service';
import { ApiRequêteService } from 'src/app/services/api-requete.service';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { ClientService } from 'src/app/modeles/client/client.service';
import { CLFService } from 'src/app/modeles/c-l-f/c-l-f.service';

@Injectable({
    providedIn: 'root'
})
export class FournisseurCLFService extends CLFService {

    controllerUrl = ApiController.livraison;

    constructor(
        protected catalogueService: CatalogueService,
        protected stockageService: StockageService,
        protected clientService: ClientService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(catalogueService, stockageService, clientService, apiRequeteService);
        this.utile.utilisateurEstLeClient = false;
    }
}
