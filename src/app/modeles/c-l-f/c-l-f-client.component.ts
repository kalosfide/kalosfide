import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { Site } from '../site/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { RouteurService } from 'src/app/services/routeur.service';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFService } from './c-l-f.service';
import { CLFUtile } from './c-l-f-utile';
import { ModeAction } from './condition-action';

/** page titre */
@Component({ template: '' })
export abstract class CLFClientComponent extends PageBaseComponent implements OnInit, OnDestroy {
    site: Site;

    clfDocs: CLFDocs;

    get titre() {
        return this.texteUtile.def.Doc + ' - ' + this.clfDocs.client.nom;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super();
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    get texteUtile() {
       return this.utile.texte.textes(this.clfDocs.type);
    }

    créeBarreTitre = (): IBarreTitre => {
        const retour = Fabrique.titrePage.groupeRetour(this.utile.lien.retourDUnClient(this.clfDocs.client));
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [retour, Fabrique.titrePage.groupeDefAccès()]
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
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                this.clfDocs = data.clfDocs;
                this.service.utile.url.fixeRouteBase(this.clfDocs.type);
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.rafraichit();

                this.subscriptions.push(
                    this.service.modeActionIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        }),
                    this.service.modeTableIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        }),
                    this.service.clfBilanIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        })
                );
                this.service.changeMode(ModeAction.edite);
            }
        ));
    }

}
