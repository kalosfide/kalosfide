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
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ClientService } from 'src/app/modeles/client/client.service';
import { FournisseurClientRoutes, FournisseurClientPages } from './client-pages';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { BootstrapNom } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';

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

    barrelien(nom: string, pageDef: PageDef, iconeDef: IKfIconeDef, texte?: string): KfLien {
        return Fabrique.lien.lienBouton({
            nom,
            urlDef: {
                routes: FournisseurClientRoutes,
                pageDef,
                urlSite: this.site.url
            },
            contenu: {
                iconeDef: iconeDef,
                texte: texte ? texte : pageDef.lien,
                positionTexte: 'droite',
            }
        },
            BootstrapNom.light);
    }

    créeBarreTitre = (): BarreTitre => {
        const groupe = Fabrique.titrePage.bbtnGroup('boutons');
        groupe.ajoute(this.service.utile.lien.accueil());
        groupe.ajoute(this.service.utile.lien.clients());
        groupe.ajoute(this.service.utile.lien.invitations());
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [groupe]
        });

        barre.ajoute(Fabrique.titrePage.groupeDefAccès());

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
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
