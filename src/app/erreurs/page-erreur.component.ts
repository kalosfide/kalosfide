import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageMessageComponent } from '../disposition/page-message/page-message.component';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageDef } from 'src/app/commun/page-def';
import { AppPages } from 'src/app/app-pages';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { ApiResultErreur } from '../api/api-results/api-result-erreur';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class PageErreurComponent extends PageBaseComponent implements OnInit, OnDestroy {
    pageDef: PageDef = AppPages.apiErreur;

    messages: string[];

    subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.créeTitrePage();
        this.subscriptions.push(this.route.data.subscribe((data: Data) => {
            const apiErreur: ApiResultErreur = data.apiErreur;
            this.titrePage = Fabrique.titrePage.titrePage(apiErreur.titre, 0);
            this.superGroupe = new KfSuperGroupe(this.nom);
            let étiquette: KfEtiquette;
            if (apiErreur.action) {
                étiquette = Fabrique.ajouteEtiquetteP();
                étiquette.ajouteTextes(apiErreur.action);
                étiquette.ajouteClasse('fw-bold');
                this.superGroupe.ajoute(étiquette);
            }
            apiErreur.messages.forEach(message => {
                étiquette = Fabrique.ajouteEtiquetteP();
                étiquette.ajouteTextes(message);
                this.superGroupe.ajoute(étiquette);
            });
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
