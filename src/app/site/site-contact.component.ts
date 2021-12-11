import { OnInit } from '@angular/core';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Site } from '../modeles/site/site';
import { IdentificationService } from '../securite/identification.service';

export abstract class SiteContactComponent extends PageBaseComponent implements OnInit {

    site: Site;

    get titre(): string {
        return 'Contacter ' + this.site.titre;
    }

    constructor(
        protected service: IdentificationService,
    ) {
        super();
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(new KfEtiquette('texte', 'contact works!'));
    }

    ngOnInit() {
        this.site = this.service.siteEnCours;
        this.créeContenus();
    }

}
