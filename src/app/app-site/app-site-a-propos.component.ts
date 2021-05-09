import { Component } from '@angular/core';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { PageDef } from 'src/app/commun/page-def';
import { AppSitePages } from './app-site-pages';
import { AppSite } from './app-site';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSiteAProposComponent extends PageBaseComponent {

    pageDef: PageDef = AppSitePages.apropos;

    get titre(): string {
        return `A propos de ${AppSite.titre}`;
    }

    constructor(    ) {
        super();
        this.créeContenus();
    }

    private créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(new KfEtiquette('texte', 'a-propos works!'));
    }

}
