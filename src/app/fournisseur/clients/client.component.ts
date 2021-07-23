import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { FournisseurPages } from '../fournisseur-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ClientService } from 'src/app/modeles/client/client.service';
import { FournisseurClientPages, FournisseurClientRoutes } from './client-pages';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
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
        protected siteService: SiteService,
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
        this.service.navigation.changementDePageDef().subscribe(() => {
            const url = this.service.navigation.dernièreUrl();
        })
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [groupe, Fabrique.titrePage.groupeDefAccès()]
        });
        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    private rafraichit() {
        this.barre.site = this.service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this.siteService.navigation.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.rafraichit();
    }

}
