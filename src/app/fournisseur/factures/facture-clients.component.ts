import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FacturePages } from './facture-pages';
import { CLFClientsComponent } from 'src/app/modeles/c-l-f/c-l-f-clients.component';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FactureClientsComponent extends CLFClientsComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FacturePages.choixClient;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
        this.fixeTypeDefRéglagesVueTable('facture');
    }
}
