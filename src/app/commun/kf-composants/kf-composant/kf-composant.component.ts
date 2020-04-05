import { Component, OnInit, Input, Output, EventEmitter, Host, Optional } from '@angular/core';
import { KfComposant } from './kf-composant';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KFComposantService } from '../kf-composant.service';

@Component({
    selector: 'app-kf-composant',
    templateUrl: './kf-composant.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfComposantComponent implements OnInit {
    @Input() composant: KfComposant;

    /**
     * permet de transmettre des évènements aux Angular components dont le template utilise des templates de KfComposantComponent
     * <app-kf-xxx [composant]="composant" (output)="fncTraite($event)"></app-kf-xxx>
     */
    @Output() output: EventEmitter<KfEvenement> = new EventEmitter();

    type = KfTypeDeComposant;
    typeDeValeur = KfTypeDeValeur;

    constructor(protected service: KFComposantService) {
    }

    ngOnInit() {
        this.service.ajoute(this.composant);
        if (this.composant.gereValeur && this.composant.gereHtml.suitLeStatut) {
            this.suitLeStatut();
        }
        if (this.composant.gereValeur && this.composant.gereHtml.suitLaValeur) {
            this.suitLaValeur();
        }
    }

    /**
     * transmission d'un évènement à l'Angular component qui utilise le template de ce component
     */
    transmet(evenement: KfEvenement) {
        this.output.emit(evenement);
    }
    /**
     * réémission d'un évènement après s'être substitué à l'émetteur et l'avoir empilé dans les parametres
     */
    reemet(evenement: KfEvenement) {
        evenement.emetteur = this.composant;
        this.output.emit(evenement);
    }
    /**
     * traitement ou transmission pour un composant qui n'est pas racine et qui n'est pas menu
     * traitement et réémission pour un composant qui est racine
     */
    traiteOuTransmet(evenement: KfEvenement) {
        if (evenement.statut === KfStatutDEvenement.aTraiter) {
            this.composant.gereHtml.traite(evenement);
        }
        /*
       console.log('traiteOuTransmet', this.composant, evenement);
                console.log('traiteOuTransmet:', {
                    composant: this.composant,
                    evenement: evenement.type,
                    traité: evenement.statut
                });
                console.log(KfdocumentContexte.focusComposant, KfdocumentContexte.prochainFocusComposant);
        */
        if (evenement.statut !== KfStatutDEvenement.fini) {
            this.output.emit(evenement);
        } else {
            if (this.composant.estRacine) {
                this.reemet(evenement);
            }
        }
    }

    /**
     * emet un KfEvenenment statutChange en réponse à un événement statusChanges de l'abstractControl
     */
    suitLeStatut() {
        this.composant.abstractControl.statusChanges.forEach(
            statut => {
                if (!this.composant.gereHtml.suspendSuitLeStatut) {
                    this.transmet(new KfEvenement(this.composant, KfTypeDEvenement.statutChange, statut));
                }
            }
        );
    }

    /**
     * emet un KfEvenenment valeurChange en réponse à un événement valueChanges de l'abstractControl
     */
    suitLaValeur() {
        this.composant.abstractControl.valueChanges.forEach(
            valeur => {
                if (!this.composant.gereHtml.suspendSuitLaValeur) {
                    this.traiteOuTransmet(new KfEvenement(this.composant, KfTypeDEvenement.valeurChange, valeur));
                }
            }
        );
    }

    /**
     * debug: log du composant
     */
    get debugComposant(): string {
        console.log('debugComposant', this.composant);
        return 'debugComposant';
    }

}
