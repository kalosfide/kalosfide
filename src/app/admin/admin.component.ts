import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RacineComponent } from '../disposition/racine/racine.component';
import { AttenteService } from '../services/attente.service';
import { IdentificationService } from '../securite/identification.service';
import { NavigationService } from '../services/navigation.service';
import { Menu } from '../disposition/menu/menu';
import { AlerteService } from '../disposition/alerte/alerte-service';
import { Identifiant } from '../securite/identifiant';
import { AdminMenu } from './admin-menu';

@Component({
    templateUrl: '../disposition/racine/racine.component.html',
})
export class AdminComponent extends RacineComponent implements OnInit, OnDestroy {

    constructor(
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

    créeMenu(): Menu {
        return new AdminMenu();
    }

    ngOnInit() {
        this._ngOnInit();
        this.menu.créeItems();
        this.menu.rafraichit();
        this.subscriptions.push(this.identification.changementDUtilisateur().subscribe(
            (identifiant: Identifiant) => this.utilisateurChange(identifiant)));
    }

}
