import { Component, OnInit, OnDestroy } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurPages } from '../fournisseur-pages';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FDocumentTitreComponent extends PageBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.documents;

    constructor(
        protected service: FournisseurCLFService,
    ) {
        super();
    }

    créeBarreTitre = (): IBarreTitre => {
        const groupe = Fabrique.titrePage.bbtnGroup('boutons');
        const clients: KfLien = Fabrique.titrePage.lien(
            this.service.utile.url.clientsBilansDocs(),
            Fabrique.icone.def.personnes, 'clients', 'Clients');
        const cherche: KfLien = Fabrique.titrePage.lien(
            this.service.utile.url.cherche(),
            Fabrique.icone.def.cherche, 'cherche', 'Recherche');
        groupe.ajoute(clients);
        groupe.ajoute(cherche);
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
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.rafraichit();
    }
}
