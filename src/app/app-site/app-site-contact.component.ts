import { Component } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { AppSitePages } from './app-site-pages';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { AppSite } from './app-site';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { Dateur } from '../commun/outils/dateur';
import { KfInputDateTemps } from '../commun/kf-composants/kf-elements/kf-input/kf-input-date-temps';

@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
})
export class AppSiteContactComponent extends PageBaseComponent {

    pageDef: PageDef = AppSitePages.contact;

    get titre(): string {
        return `Contacter ${AppSite.titre}`;
    }

    constructor() {
        super();
        this.créeContenus();
    }

    private créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.estRacineV = true;
        this.superGroupe.avecInvalidFeedback = true;

        const dateTemps = new KfInputDateTemps('dateTemps', 'dateTemps');
        const d0 = new Date();
        const d1 = Dateur.ajouteHeures(d0, 1);
        dateTemps.valeur = d1;
        dateTemps.ajouteValidateur(KfValidateurs.validateurDeFn('maintenant_plus',
            (value: Date) => {
                const maintenant = new Date();
                return value.valueOf() <= maintenant.valueOf();
            },
            'La moment choisi est déjà passé.'));
        this.superGroupe.ajoute(dateTemps);

        this.superGroupe.sauveQuandChange = true;
        this.superGroupe.quandTousAjoutés();
    }

}
