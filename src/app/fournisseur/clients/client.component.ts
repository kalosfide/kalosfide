import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { FournisseurPages } from '../fournisseur-pages';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ClientService } from 'src/app/modeles/client/client.service';
import { FournisseurClientPages } from './client-pages';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientComponent extends PageBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.clients;

    site: Site;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super();
    }

    créeBarreTitre = (): IBarreTitre => {
        const groupe = Fabrique.titrePage.bbtnGroup('boutons');
        const accueil: KfLien = Fabrique.titrePage.lien(
            this.service.utile.urlKey.dePageDef(FournisseurClientPages.accueil),
            Fabrique.icone.def.info);
        const clients: KfLien = Fabrique.titrePage.lien(
            this.service.utile.urlKey.dePageDef(FournisseurClientPages.index),
            Fabrique.icone.def.personnes);
        const invitations: KfLien = Fabrique.titrePage.lien(
            this.service.utile.urlKey.dePageDef(FournisseurClientPages.invitations),
            Fabrique.icone.def.envelope_pleine);
        groupe.ajoute(accueil);
        groupe.ajoute(clients);
        groupe.ajoute(invitations);
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [groupe, Fabrique.titrePage.groupeDefAccès()]
        });
        this.barre = barre;
        return barre;
    }

    private rafraichit() {
        this.barre.site = this.service.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this.service.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.rafraichit();
    }

}
