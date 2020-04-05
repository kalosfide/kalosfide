import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { ClientCLFService } from '../client-c-l-f.service';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { CommandePages } from './commande-pages';
import { CLFLigneComponent } from 'src/app/modeles/c-l-f/c-l-f-ligne.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommandeLigneSupprimeComponent extends CLFLigneComponent implements OnInit, OnDestroy {
    pageDef: PageDef = CommandePages.supprime;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, service, peutQuitterService);
        this.suppression = true;
    }
}
