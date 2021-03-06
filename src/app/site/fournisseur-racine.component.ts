import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AttenteService } from '../services/attente.service';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from '../services/navigation.service';
import { FournisseurMenu } from '../fournisseur/fournisseur-menu';
import { ActivatedRoute } from '@angular/router';
import { Menu } from '../disposition/menu/menu';
import { SiteRacineComponent } from './site-racine.component';
import { AlerteService } from '../disposition/alerte/alerte-service';

@Component({
    templateUrl: '../disposition/racine/racine.component.html',
})
export class FournisseurRacineComponent extends SiteRacineComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
        protected titleService: Title,
        protected attenteService: AttenteService,
        protected identification: IdentificationService,
        protected navigation: NavigationService,
        protected alerteService: AlerteService,
    ) {
        super(
            route,
            titleService,
            attenteService,
            identification,
            navigation,
            alerteService,
        );
    }

    créeMenu(): Menu {
        return new FournisseurMenu();
    }

}
