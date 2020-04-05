import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Alerte, TypeAlerte } from './alerte';
import { AlerteService } from './alerte-service';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
    selector: 'app-alerte',
    templateUrl: 'alerte.component.html',
    styleUrls: [
        'alerte.component.css',
        '../../commun/commun.scss'
    ]
})

export class AlerteComponent implements OnInit, OnDestroy {

    alertes: Alerte[];

    subscriptions: Subscription[] = [];

    constructor(
        private alerteService: AlerteService,
        private navigationService: NavigationService,
    ) { }

    ngOnInit() {
        this.alertes = this.alerteService.alertes;
        this.subscriptions.push(this.alerteService.alertesChangé$().subscribe((changé: boolean) => {
            this.alertes = this.alerteService.alertes;
        }));
        this.subscriptions.push(this.navigationService.changementHistorique().subscribe((changé: boolean) => {
            const url = this.navigationService.dernièreUrl();
            this.alertes.forEach(a => a.vérifieUrl(url));
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    ferme(alerte: Alerte) {
        this.alerteService.supprime(alerte.id);
    }
}
