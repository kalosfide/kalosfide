
import { Observable, Subscription } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { AfficheResultat } from '../affiche-resultat/affiche-resultat';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../api/api-results/api-result';

import { DataService } from '../../services/data.service';

import { PageBaseComponent } from '../page-base/page-base.component';
import { ResultatAction } from 'src/app/disposition/affiche-resultat/resultat-affichable';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { RouteurService } from 'src/app/services/routeur.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { NavigationService } from 'src/app/services/navigation.service';

export abstract class FormulaireBaseComponent extends PageBaseComponent {

    titreRésultatErreur: string;
    titreRésultatSucces: string;

    abstract actionSiOk: (créé?: any) => void;
    actionSiErreur: (resultat: ResultatAction) => void;
    abstract apiDemande: () => Observable<ApiResult>;

    // membres communs
    formulaire: KfGroupe;

    subscriptions: Subscription[] = [];

    boutonSoumettre: KfBouton;
    afficheResultat: AfficheResultat;

    constructor(
        protected service: DataService,
    ) {
        super();
    }

    get iservice(): DataService {
        return this.service;
    }

    get identification(): IdentificationService { return this.service.identification; }
    get routeur(): RouteurService { return this.service.routeur; }
    get navigation(): NavigationService { return this.service.navigation; }

    get valeur(): any {
        return this.formulaire.formGroup.value;
    }
    set valeur(valeur: any) {
        this.formulaire.formGroup.setValue(valeur);
    }

    get soumet(): (() => void) {
        return () => {
            const apiRequêteAction: ApiRequêteAction = {
                demandeApi: this.apiDemande,
                actionSiOk: this.actionSiOk,
                formulaire: this.superGroupe,
                afficheResultat: this.afficheResultat,
                titreErreur: this.titreRésultatErreur,
                titreSucces: this.titreRésultatSucces
            };
            const subscription = this.service.actionObs(apiRequêteAction).subscribe(() => {
                subscription.unsubscribe();
            });
        }
    }
}
