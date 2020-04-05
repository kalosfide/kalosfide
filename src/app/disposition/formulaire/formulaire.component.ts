import { OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../commun/api-results/api-result';

import { DataService } from '../../services/data.service';

import { FormulaireBaseComponent } from './formulaire-base.component';
import { Fabrique } from '../fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { IFormulaireDef } from '../fabrique/fabrique-formulaire';

export abstract class FormulaireComponent extends FormulaireBaseComponent implements IFormulaireDef, OnInit, OnDestroy {

    abstract créeEdition: () => KfGroupe;
    abstract créeBoutonsDeFormulaire: (formulaire: KfSuperGroupe) => (KfBouton | KfLien)[];

    abstract actionSiOk: (créé?: any) => void;
    abstract apiDemande: () => Observable<ApiResult>;

    // membres communs
    formulaire: KfSuperGroupe;
    avantEdition: () => KfComposant[];
    edition: KfGroupe;
    aprèsBoutons: () => KfComposant[];

    constructor(
        protected service: DataService,
    ) {
        super(service);
    }

    ngOnInit() {
        this.formulaire = Fabrique.formulaire.formulaire(this);
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.soumet) {
            this.soumet();
        }
    }

}
