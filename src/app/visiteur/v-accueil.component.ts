import { Component, OnInit } from '@angular/core';
import { Site } from '../modeles/site/site';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { VisiteurPages } from './visiteur-pages';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';

@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
})
export class VAccueilComponent extends PageBaseComponent implements OnInit {
    pageDef: PageDef = VisiteurPages.accueil;

    site: Site;

    get titre(): string {
        return this.site.titre;
    }

    constructor(
        protected service: NavigationService,
    ) {
        super();
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        const titre = new KfEtiquette('titre', this.titre);
        titre.baliseHtml = KfTypeDeBaliseHTML.h4;
        this.superGroupe.ajoute(titre);
    }

    ngOnInit() {
        this.site = this.service.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
    }

}
