import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEvenement, KfTypeDEvenement } from '../../commun/kf-composants/kf-partages/kf-evenements';
import { KfBouton } from '../../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';

import { ApiResult } from '../../api/api-results/api-result';

import { DataService } from '../../services/data.service';

import { FormulaireBaseComponent } from './formulaire-base.component';
import { Fabrique } from '../fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { GroupeBoutonsMessages, IFormulaireComponent } from '../fabrique/fabrique-formulaire';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({ template: '' })
export abstract class FormulaireComponent extends FormulaireBaseComponent implements IFormulaireComponent, OnInit, OnDestroy {

    abstract créeEdition: () => KfGroupe;
    abstract créeBoutonsDeFormulaire: (formulaire: KfSuperGroupe) => (KfBouton | KfLien)[];

    abstract actionSiOk: (créé?: any) => void;
    abstract apiDemande: () => Observable<ApiResult>;

    groupeBoutonsMessages: GroupeBoutonsMessages;

    // membres communs
    créeAvantFormulaire: () => KfComposant[];
    aprèsBoutons: () => KfComposant[];

    constructor(
        protected service: DataService,
    ) {
        super(service);
    }

    ngOnInit() {
        this.superGroupe = Fabrique.formulaire.superGroupe(this);
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    protected _message(i: number): KfEtiquette {
        return (this.groupeBoutonsMessages.messages[i]) as KfEtiquette;
    }

    traite(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.submit) {
            this.soumet();
        }
    }

}
