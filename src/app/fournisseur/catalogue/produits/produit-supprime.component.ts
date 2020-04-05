import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduitALESComponent } from './produit-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitPages } from './produit-pages';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';


@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
    styleUrls: ['../../../commun/commun.scss']
})
export class ProduitSupprimeComponent extends ProduitALESComponent {

    pageDef: PageDef = ProduitPages.supprime;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionSupprime();
        this.action.actionSiOk = () => this.service.quandSupprime(this.produit);
    }

}