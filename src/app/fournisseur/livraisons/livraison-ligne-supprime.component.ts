import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { LivraisonPages } from './livraison-pages';
import { CLFLigneSupprimeComponent } from 'src/app/modeles/c-l-f/c-l-f-ligne-supprime.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonLigneSupprimeComponent extends CLFLigneSupprimeComponent implements OnInit, OnDestroy {
    pageDef: PageDef = LivraisonPages.supprime;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }
}
