import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { CLFTitreComponent } from 'src/app/modeles/c-l-f/c-l-f-titre.component';
import { ClientPages } from '../client-pages';
import { ClientCLFService } from '../client-c-l-f.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CDocumentTitreComponent extends CLFTitreComponent implements OnInit, OnDestroy {

    pageDef: PageDef = ClientPages.documents;

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
    }
}
