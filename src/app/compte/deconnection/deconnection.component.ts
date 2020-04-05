import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompteService } from '../compte.service';
import { AttenteService } from '../../services/attente.service';
import { Subscription } from 'rxjs';
import { RouteurService } from 'src/app/services/routeur.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

@Component({
    selector: 'app-deconnection',
    templateUrl: './deconnection.component.html',
    styles: []
})
export class DeconnectionComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    attente: number;

    constructor(
        private service: CompteService,
        private attenteService: AttenteService,
    ) { }

    ngOnInit() {
        this.attente = this.attenteService.commence('déconnecte');
        this.subscription = this.service.déconnecte().subscribe(
            () => {
                this.attenteService.finit(this.attente);
                this.service.routeur.navigue();
            },
            () => {
                this.attenteService.finit(this.attente);
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
