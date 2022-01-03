import { Observable } from 'rxjs';
import { IdentificationService } from '../securite/identification.service';
import { ApiResult } from '../api/api-results/api-result';
import { RouteurService } from './routeur.service';
import { NavigationService } from './navigation.service';
import { AttenteService } from './attente.service';
import { IKeyId } from '../commun/data-par-key/key-id/i-key-id';
import { KfNgbModalService } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal.service';
import { ApiRequêteAction } from '../api/api-requete-action';
import { ApiRequêteLecture } from '../api/api-requete-lecture';
import { ApiRequêteService } from '../api/api-requete.service';
import { IAvecServices } from './i-avec-services';
import { KfVueTableRéglages } from '../commun/kf-composants/kf-vue-table/kf-vue-table-reglages';
import { Stockage } from './stockage/stockage';
import { StockageService } from './stockage/stockage.service';
import { Site } from '../modeles/site/site';
import { Identifiant } from '../securite/identifiant';

export abstract class DataService implements IAvecServices {

    abstract controllerUrl: string;

    private stockageRéglagesVueTable: Stockage<{ [key: string]: KfVueTableRéglages }>;

    constructor(
        protected stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        const nomRéglages = 'reglageVueTable';
        this.stockageRéglagesVueTable = stockageService.stockage<{ [key: string]: KfVueTableRéglages }>(nomRéglages);
        if (!this.stockageRéglagesVueTable) {
            this.stockageRéglagesVueTable = stockageService.nouveau<{ [key: string]: KfVueTableRéglages }>(
                nomRéglages,
                {
                    rafraichi: true
                }
            );
        }
    }

    get identification(): IdentificationService { return this.apiRequeteService.identification; }
    get routeur(): RouteurService { return this.apiRequeteService.routeur; }
    get navigation(): NavigationService { return this.apiRequeteService.navigation; }
    get attenteService(): AttenteService { return this.apiRequeteService.attenteService; }
    get modalService(): KfNgbModalService { return this.apiRequeteService.modalService; }

    public litSiteEnCours(): Site {
        return this.identification.siteEnCours;
    }

    public litRéglagesVueTable(nom: string): KfVueTableRéglages {
        const réglages = this.stockageRéglagesVueTable.litStock();
        if (réglages) {
            return réglages[nom];
        }
    }

    public fixeRéglagesVueTable(nom: string, réglages: KfVueTableRéglages) {
        let stock = this.stockageRéglagesVueTable.litStock();
        if (!stock) {
            stock = {};
        }
        stock[nom] = réglages;
        this.stockageRéglagesVueTable.fixeStock(stock);
    }

    protected post<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.post<T>(controller, action, data, params);
    }

    protected put<T>(controller: string, action: string, data?: T, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.put<T>(controller, action, data, params);
    }

    protected delete(controller: string, action: string, params: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.delete(controller, action, params);
    }

    protected getSansParamsSansIdentification(controller: string, action: string): Observable<ApiResult> {
        return this.apiRequeteService.getSansParamsSansIdentification(controller, action);
    }

    protected get<T>(controller: string, action: string, params?: string | { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.get<T>(controller, action, params);
    }

    protected getAll<T>(controller: string, action: string, params?: { [param: string]: string }): Observable<ApiResult> {
        return this.apiRequeteService.getAll<T>(controller, action, params);
    }

    public actionObs(requêteActionDef: ApiRequêteAction): Observable<boolean> {
        return this.apiRequeteService.actionObs(requêteActionDef);
    }

    public lectureObs<T>(requêteLectureDef: ApiRequêteLecture): Observable<T> {
        return this.apiRequeteService.lectureObs<T>(requêteLectureDef);
    }

}
