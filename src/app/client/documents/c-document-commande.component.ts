import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { CDocumentDocComponent } from './c-document-doc.component';
import { ClientCLFService } from '../client-c-l-f.service';
import { CDocumentPages } from './c-document-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CDocumentCommandeComponent extends CDocumentDocComponent implements OnInit, OnDestroy {

    pageDef: PageDef = CDocumentPages.commande;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }
}
