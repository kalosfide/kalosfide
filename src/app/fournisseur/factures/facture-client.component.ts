import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FacturePages } from './facture-pages';
import { CLFClientComponent } from 'src/app/modeles/c-l-f/c-l-f-client.component';
import { SiteService } from 'src/app/modeles/site/site.service';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FactureClientComponent extends CLFClientComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FacturePages.client;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
        protected siteService: SiteService,
    ) {
        super(route, service, siteService);
    }
}
