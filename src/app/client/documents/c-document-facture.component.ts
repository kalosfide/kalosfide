import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { CDocumentPages } from './c-document-pages';
import { CDocumentDocComponent } from './c-document-doc.component';
import { ClientCLFService } from '../client-c-l-f.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CDocumentFactureComponent extends CDocumentDocComponent implements OnInit, OnDestroy {

    pageDef: PageDef = CDocumentPages.facture;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }
}
