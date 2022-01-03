
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { IDataKey } from './data-key';
import { ApiAction } from '../../api/api-route';
import { DataUtile } from 'src/app/commun/data-par-key/data-utile';
import { ValeurEtObservable } from '../outils/valeur-et-observable';
import { ModeTable } from './condition-table';
import { DataKeyUtile } from './data-key-utile';
import { ApiResult } from 'src/app/api/api-results/api-result';

export abstract class DataKeyService<T extends IDataKey> extends DataService {

    protected pUtile: DataUtile;

    get dataService(): DataService { return this; }

    protected pModeTableIO: ValeurEtObservable<ModeTable>;

    abstract urlSegmentDeKey(key: T): string;
    fragment(t: T): string {
        return this.pUtile.url.id(this.urlSegmentDeKey(t));
    }

    protected _créeUtile() {
        this.pUtile = new DataUtile(this);
    }

    créeUtile() {
        this.pModeTableIO = ValeurEtObservable.nouveau<ModeTable>(ModeTable.sans);
        this._créeUtile();
        this.pUtile.observeModeTable(this.pModeTableIO);
    }

    initialiseModeTable(modeTable: ModeTable) {
        this.changeModeTable(modeTable);
    }

    get utile(): DataKeyUtile<T> {
        return this.pUtile as DataKeyUtile<T>;
    }

    changeModeTable(mode: ModeTable) {
        this.pModeTableIO.changeValeur(mode);
    }

    get modeTable(): ModeTable {
        return this.pModeTableIO.valeur;
    }

    get modeTableIO(): ValeurEtObservable<ModeTable> {
        return this.pModeTableIO;
    }

    protected abstract créeParams(key: any): { [param: string]: string };
    /**
     * demande à l'Api d'ajouter un objet à la base de données
     * @param objet contient la clé (incomplète si numAuto) et tous les autres champs
     */
    ajoute(objet: T): Observable<ApiResult> {
        return this.post<T>(this.controllerUrl, ApiAction.data.ajoute, objet);
    }

    lit(key: IDataKey): Observable<ApiResult> {
        console.log(key);
        return this.get<T>(this.controllerUrl, ApiAction.data.lit, this.créeParams(key));
    }

    /**
     * demande à l'Api de modifier un objet de la base de données
     * @param objet contient la clé et les champs à modifier
     */
    edite(objet: T): Observable<ApiResult> {
        return this.put<T>(this.controllerUrl, ApiAction.data.edite, objet);
    }

    /**
     * demande à l'Api de supprimer un objet de la base de données
     * @param key clé de l'objet à supprimer
     */
    supprime(key: IDataKey): Observable<ApiResult> {
        return this.delete(this.controllerUrl, ApiAction.data.supprime, this.créeParams(key));
    }

}
