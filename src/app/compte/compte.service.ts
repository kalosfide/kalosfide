import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';

import { ApiResult } from '../api/api-results/api-result';
import { ConnectionModel } from './connection/connection.model';
import { map, tap } from 'rxjs/operators';
import { ApiController, ApiAction } from 'src/app/api/api-route';
import { ApiRequêteService } from '../api/api-requete.service';
import { ConfirmeEmailModel } from './confirme-email/confirme-email.model';
import { AjouteModel } from './ajoute/ajoute.model';
import { OubliMotDePasseModel } from './oubli-mot-de-passe/oubli-mot-de-passe.model';
import { RéinitialiseMotDePasseModel } from './réinitialise-mot-de-passe/réinitialise-mot-de-passe.model';
import { ChangeMotDePasseModel } from './change-mot-de-passe/change-mot-de-passe.model';
import { ChangeEmailModel } from './change-email/change-email.model';
import { DevenirClientModel } from '../app-site/devenir-client/devenir-client.model';
import { DevenirClientData } from '../app-site/devenir-client/devenir-client-data';
import { Site } from '../modeles/site/site';
import { ReglesDeMotDePasse } from '../securite/mot-de-passe';

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

    public get règlesDeMotDePasse(): ReglesDeMotDePasse {
        const production = false;
        return {
            noSpaces: true,
            requireDigit: true,
            requireLowercase: !production,
            requireUppercase: !production,
            requireNonAlphanumeric: !production,
            requiredLength: production ? 10 : 6
        };
    }

    public ajoute(ajouteModel: AjouteModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.ajoute, ajouteModel);
    }

    public confirmeEmail(confirmeEmailModel: ConfirmeEmailModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.confirmeEmail, confirmeEmailModel);
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

    public sessionPasTerminée(): Observable<boolean> {
        const demandeApi = () => this.get(ApiController.utilisateur, ApiAction.utilisateur.session);
        return this.lectureObs<boolean>({ demandeApi }).pipe(map(() => true));
    }

    public oubliMotDePasse(oubliMotDePasseModel: OubliMotDePasseModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.oubliMotDePasse, oubliMotDePasseModel);
    }

    public réinitialiseMotDePasse(réinitialiseMotDePasseModel: RéinitialiseMotDePasseModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.réinitialiseMotDePasse, réinitialiseMotDePasseModel);
    }

    public changeMotDePasse(changeMotDePasseModel: ChangeMotDePasseModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.changeMotDePasse, changeMotDePasseModel);
    }

    public changeEmail(changeEmailModel: ChangeEmailModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.changeEmail, changeEmailModel);
    }

    public confirmeChangeEmail(confirmeChangeEmailModel: ConfirmeEmailModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.confirmeChangeEmail, confirmeChangeEmailModel);
    }

    public invitationClient(code: string): Observable<DevenirClientData> {
        const demandeApi = () => this.get<DevenirClientData>(ApiController.utilisateur, ApiAction.utilisateur.invitation, { code });
        return this.lectureObs<DevenirClientData>({ demandeApi });
    }

    public enregistreClient(data: DevenirClientModel): Observable<ApiResult> {
        return this.post(ApiController.utilisateur, ApiAction.utilisateur.devenirClient, data);
    }

    public créeSite(data: Site): Observable<ApiResult> {
        return this.post(ApiController.site, ApiAction.site.ajoute, data);
    }

}
