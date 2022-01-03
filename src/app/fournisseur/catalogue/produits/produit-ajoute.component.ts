import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduitALESComponent } from './produit-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitPages } from './produit-pages';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Categorie } from 'src/app/modeles/catalogue/categorie';

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
            this.service.quandAjoute(this.produit);
        };
        this.créeAvantFormulaire = () => {
            const groupe = new KfGroupe('ajoutCategorie');
            return [groupe];
        }
    }

    quandCatégorieAjoutée(catégorie: Categorie) {}

}
