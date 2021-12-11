import { Component, OnInit, OnDestroy } from '@angular/core';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurPages } from '../fournisseur-pages';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IBarreTitre, IBarreDef, IBtnGroupeDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfBBtnGroup } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { Client } from 'src/app/modeles/client/client';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FDocumentClientTitreComponent extends PageBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.documents;

    client: Client;

    get titre() {
        return this.client.nom;
    }

    constructor(
        private route: ActivatedRoute,
        private service: FournisseurCLFService,
    ) {
        super();
        this.niveauTitre = 1;
    }

    créeBarreTitre = (): IBarreTitre => {
        const def: IBarreDef = {
            pageDef: this.pageDef,
            groupesDeBoutons: [
                Fabrique.titrePage.groupeRetour(this.service.utile.lien.retourDUnClientVersBilansDocs(this.client)),
                Fabrique.titrePage.groupeDefAccès()]
        };
        const barre = Fabrique.titrePage.barreTitre(def);
        this.barre = barre;
        return barre;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.route.data.subscribe(
                (data: Data) => {
                    this.client = data.client;
                    this.créeTitrePage();
                    this.barre.site = this.service.litSiteEnCours();
                    this.barre.rafraichit();
                })
        );
    }
}
