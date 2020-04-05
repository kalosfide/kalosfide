import { Component, OnInit, OnDestroy } from '@angular/core';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { FormulaireAEtapeService } from './formulaire-a-etapes.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EtapeDeFormulaire } from './etape-de-formulaire';

@Component({
    templateUrl: './etape-de-formulaire.component.html',
    styleUrls: ['../../commun/commun.scss']
})
export class EtapeDeFormulaireComponent implements OnInit, OnDestroy {
    etape: EtapeDeFormulaire;

    subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private etapesService: FormulaireAEtapeService,
    ) {}

    get formulaire(): KfSuperGroupe {
        return this.etape.parent.formulaire;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe((data: { index: number }) => {
            this.etape = this.etapesService.formulaireAEtapes.etapes[data.index];
            this.etapesService.index = this.etape.index;
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
