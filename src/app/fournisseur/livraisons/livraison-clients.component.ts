import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { LivraisonPages } from './livraison-pages';
import { PageDef } from 'src/app/commun/page-def';
import { CLFClientsComponent } from 'src/app/modeles/c-l-f/c-l-f-clients.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class LivraisonClientsComponent extends CLFClientsComponent implements OnInit, OnDestroy {

    pageDef: PageDef = LivraisonPages.choixClient;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
        this.fixeTypeDefRéglagesVueTable('livraison');
    }
}
