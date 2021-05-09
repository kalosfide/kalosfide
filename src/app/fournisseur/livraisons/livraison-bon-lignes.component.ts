import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { LivraisonBonComponent } from './livraison-bon.component';
import { LivraisonPages } from './livraison-pages';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class LivraisonBonLignesComponent extends LivraisonBonComponent implements OnInit, OnDestroy {

    pageDef: PageDef = LivraisonPages.lignes;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.edite;
    }
}
