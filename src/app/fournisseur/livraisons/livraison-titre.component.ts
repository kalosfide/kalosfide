import { Component, OnInit, OnDestroy } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { PageDef } from 'src/app/commun/page-def';
import { CLFTitreComponent } from 'src/app/modeles/c-l-f/c-l-f-titre.component';
import { FournisseurPages } from '../fournisseur-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class LivraisonTitreComponent extends CLFTitreComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.livraison;

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }
}
