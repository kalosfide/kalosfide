import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { PageDef } from 'src/app/commun/page-def';
import { LivraisonPages } from './livraison-pages';
import { CLFChoixProduitComponent } from 'src/app/modeles/c-l-f/c-l-f-choix-produit.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class LivraisonChoixProduitComponent extends CLFChoixProduitComponent implements OnInit, OnDestroy {

    pageDef: PageDef = LivraisonPages.choixProduit;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
        this.fixeTypeDefRéglagesVueTable('livraison');
    }
}
