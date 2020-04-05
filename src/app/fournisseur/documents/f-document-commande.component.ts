import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { FDocumentPages } from './f-document-pages';
import { FDocumentDocComponent } from './f-document-doc.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class FDocumentCommandeComponent extends FDocumentDocComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FDocumentPages.commande;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }
}