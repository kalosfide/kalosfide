import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompteService } from '../compte.service';
import { Attente, AttenteService } from '../../services/attente.service';
import { Subscription } from 'rxjs';
import { AppSitePages } from 'src/app/app-site/app-site-pages';

@Component({
    selector: 'app-deconnection',
    templateUrl: './deconnection.component.html',
    styles: []
})
export class DeconnectionComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    attente: Attente;

    constructor(
        private service: CompteService,
        private attenteService: AttenteService,
    ) { }

    ngOnInit() {
        this.attente = this.attenteService.attente('déconnecte');
        this.attente.commence();
        this.subscription = this.service.déconnecte().subscribe(
            () => {
                this.attente.finit();
                this.service.routeur.naviguePageDef(AppSitePages.accueil);
            },
            () => {
                this.attente.finit();
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
