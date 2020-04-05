import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { CDocumentDocComponent } from './c-document-doc.component';
import { CDocumentPages } from './c-document-pages';
import { ClientCLFService } from '../client-c-l-f.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CDocumentLivraisonComponent extends CDocumentDocComponent implements OnInit, OnDestroy {

    pageDef: PageDef = CDocumentPages.livraison;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }
}
