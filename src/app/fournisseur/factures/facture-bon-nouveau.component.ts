import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { FacturePages } from './facture-pages';
import { FactureBonComponent } from './facture-bon.component';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class FactureBonNouveauComponent extends FactureBonComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FacturePages.nouveau;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.doitCréer;
    }
}
