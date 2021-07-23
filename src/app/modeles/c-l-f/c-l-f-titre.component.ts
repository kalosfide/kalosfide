import { Component, OnInit } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { IBarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { CLFService } from './c-l-f.service';

@Component({ template: '' })
export abstract class CLFTitreComponent extends PageBaseComponent implements OnInit {
    estClient: 'client';

    niveauTitre = 0;

    protected contenuAidePage: () => KfComposant[];

    constructor(
        protected service: CLFService,
    ) {
        super();
    }

    créeBarreTitre = (): IBarreTitre => {
        const def: IBarreDef = {
            pageDef: this.pageDef,
            groupesDeBoutons: [Fabrique.titrePage.groupeDefAccès(this.estClient)]
        };
        if (this.contenuAidePage) {
            def.contenuAidePage = this.contenuAidePage();
        }
        const barre = Fabrique.titrePage.barreTitre(def);
        this.barre = barre;
        return barre;
    }

    ngOnInit() {
        this.créeTitrePage();
        this.barre.site = this.service.navigation.litSiteEnCours();
        this.barre.rafraichit();

        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(
                () => {
                    this.barre.site = this.service.navigation.litSiteEnCours();
                    this.barre.rafraichit();
                }),
            this.service.modeTableIO.observable.subscribe(
                () => {
                    this.barre.site = this.service.navigation.litSiteEnCours();
                    this.barre.rafraichit();
                }),
        );
    }

}
