import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategorieALESComponent } from './categorie-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { CategoriePages } from './categorie-pages';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
    styleUrls: ['../../../commun/commun.scss']
})
export class CategorieEditeComponent extends CategorieALESComponent {

    pageDef: PageDef = CategoriePages.edite;

    constructor(
        protected route: ActivatedRoute,
        protected service: CategorieService,
    ) {
        super(route, service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionEdite();
        this.action.actionSiOk = () => this.service.quandEdite(this.categorie);
    }

}
