import { OnInit } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { BarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { CLFService } from './c-l-f.service';

export abstract class CLFTitreComponent extends PageBaseComponent implements OnInit {
    estClient: 'client';

    niveauTitre = 0;
    barre: BarreTitre;

    protected contenuAidePage: () => KfComposant[];

    constructor(
        protected service: CLFService,
    ) {
        super();
    }

    créeBarreTitre = (): BarreTitre => {
        const def: IBarreDef = { pageDef: this.pageDef };
        if (this.contenuAidePage) {
            def.contenuAidePage = this.contenuAidePage();
        }
        const barre = Fabrique.titrePage.barreTitre(def);
        barre.ajoute(Fabrique.titrePage.groupeDefAccès(this.estClient));
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
