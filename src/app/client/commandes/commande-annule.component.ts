import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { ClientCLFService } from '../client-c-l-f.service';
import { CommandeComponent } from './commande.component';
import { CommandePages } from './commande-pages';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CommandeAnnuleComponent extends CommandeComponent implements OnInit, OnDestroy {

    pageDef: PageDef = CommandePages.annule;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.supprime;
    }
}
