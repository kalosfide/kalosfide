import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiRequêteService } from "../api/api-requete.service";
import { ApiResult } from "../api/api-results/api-result";
import { ApiController } from "../api/api-route";
import { Fournisseur } from "../modeles/fournisseur/fournisseur";
import { DataService } from "../services/data.service";
import { StockageService } from "../services/stockage/stockage.service";

@Injectable()
export class AdminService extends DataService {
    controllerUrl = ApiController.admin;

    constructor(
        protected stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(stockageService, apiRequeteService);
    }

}