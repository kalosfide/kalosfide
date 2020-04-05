import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FacturePages } from './facture-pages';
import { SiteService } from 'src/app/modeles/site/site.service';
import { CLFClientsComponent } from 'src/app/modeles/c-l-f/c-l-f-clients.component';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class FactureClientsComponent extends CLFClientsComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FacturePages.choixClient;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
        protected siteService: SiteService,
    ) {
        super(route, service, siteService);
    }
}
