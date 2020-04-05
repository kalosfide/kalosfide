import { Observable, of, EMPTY } from 'rxjs';
import { ApiResult } from '../commun/api-results/api-result';
import { AfficheResultat } from '../disposition/affiche-resultat/affiche-resultat';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { ResultatAction } from '../disposition/affiche-resultat/resultat-affichable';

export class ApiRequêteAction {
    demandeApi: () => Observable<ApiResult>;
    actionSiOk: (créé?: any) => void;
    formulaire?: KfSuperGroupe;
    afficheResultat?: AfficheResultat;
    traiteErreur?: (apiResult: ApiResult) => boolean;
    titreErreur?: string;
    titreSucces?: string;
    attente?: { commence: () => void; finit: () => void };
}
