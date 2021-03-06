import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduitALESComponent } from './produit-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitPages } from './produit-pages';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { IdEtatProduit } from 'src/app/modeles/catalogue/etat-produit';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
})
export class ProduitAjouteComponent extends ProduitALESComponent implements OnInit {

    pageDef: PageDef = ProduitPages.ajoute;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionAjoute();
        this.action.actionSiOk = () => {
            if (this.produit.etat === IdEtatProduit.disponible) {
                this.metAJourNbProduits(1);
            }
            this.service.quandAjoute(this.produit);
        };
    }

}
