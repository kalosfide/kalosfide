import { OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AttenteService } from '../services/attente.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { RacineComponent } from '../disposition/racine/racine.component';
import { ActivatedRoute } from '@angular/router';
import { Site } from '../modeles/site/site';
import { AlerteService } from '../disposition/alerte/alerte-service';

export abstract class SiteRacineComponent extends RacineComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
        protected titleService: Title,
        protected attenteService: AttenteService,
        protected identification: IdentificationService,
        protected navigation: NavigationService,
        protected alerteService: AlerteService,
    ) {
        super(
            titleService,
            attenteService,
            identification,
            navigation,
            alerteService,
        );
    }

    ngOnInit() {
        this._ngOnInit();
        this.subscriptions.push(this.route.data.subscribe((data: { site: Site }) => {
            this.menu.site = data.site;
            this.menu.site = this.navigation.litSiteEnCours();
            this.menu.créeItems();
            this.menu.rafraichit();
            this.subscriptions.push(this.navigation.siteObs().subscribe((site: Site) => this.siteChange(site)));
            this.subscriptions.push(this.identification.changementDUtilisateur().subscribe(() => this.utilisateurChange()));
        }));
    }

    private siteChange(site: Site) {
        this.menu.site = site;
        this.menu.rafraichit();
    }

}
