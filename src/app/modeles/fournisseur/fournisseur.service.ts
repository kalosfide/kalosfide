import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiAction, ApiController } from '../../api/api-route';
import { KeyUidRnoService } from '../../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { ApiRequêteService } from '../../api/api-requete.service';
import { FournisseurUtile } from './fournisseur-utile';
import { StockageService } from 'src/app/services/stockage/stockage.service';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { KeyUidRno, KeyUidRnoActif } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { Fournisseur } from './fournisseur';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FournisseurService extends KeyUidRnoService<Fournisseur> {

    controllerUrl = ApiController.admin;

    constructor(
        protected stockageService: StockageService,
        protected apiRequeteService: ApiRequêteService
    ) {
        super(stockageService, apiRequeteService);
        this.créeUtile();
    }

    protected _créeUtile() {
        this.pUtile = new FournisseurUtile(this);
    }

    get utile(): FournisseurUtile {
        return this.pUtile as FournisseurUtile;
    }

    public active(fournisseur: Fournisseur, active: boolean): Observable<ApiResult> {
        const keyActif: KeyUidRnoActif = {
            uid: fournisseur.uid,
            rno: fournisseur.rno,
            actif: active
        }
        return this.post(this.controllerUrl, ApiAction.admin.active, keyActif);
    }

    public liste(): Observable<Fournisseur[]> {
        const demandeApi = () => this.get<Fournisseur[]>(this.controllerUrl, ApiAction.admin.fournisseurs);
        return this.lectureObs<Fournisseur[]>({ demandeApi }).pipe(
            tap(x => {
                console.log(x);
            })
        );
    }
}
