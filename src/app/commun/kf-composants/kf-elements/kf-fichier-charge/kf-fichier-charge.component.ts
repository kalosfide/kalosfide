import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfFichierCharge, KfResultatFichierCharge } from './kf-fichier-charge';
import { KfEvenement, KfStatutDEvenement, KfTypeDEvenement } from '../../kf-partages/kf-evenements';
import { LitFichierTexteService } from '../../../outils/lit-fichier-texte.service';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-fichier-charge',
    template: `
    <app-kf-fichier [composant]="fichier.fichier" (output)="quandChoisis($event)"></app-kf-fichier>
`,
    styleUrls: ['../../kf-composants.scss']
})
export class KfFichierChargeComponent extends KfComposantComponent implements OnInit, AfterViewInit {

    texte: string;

    constructor(private litFichier: LitFichierTexteService,
                protected service: KFComposantService) {
        super(service);
    }

    get fichier(): KfFichierCharge { return this.composant as KfFichierCharge; }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    quandChoisis(evenement: KfEvenement) {
        const files = evenement.parametres as FileList;
        evenement.type = KfTypeDEvenement.fichierCharge;
        const resultat: KfResultatFichierCharge = { file: files[0] };
        const subsbscription = this.litFichier.litFichier(files[0]).subscribe({
            next: texte => {
                subsbscription.unsubscribe();
                resultat.texte = texte;
                evenement.parametres = resultat;
                this.reemet(evenement);
            },
            error: err => {
                subsbscription.unsubscribe();
                resultat.erreur = err;
                evenement.parametres = resultat;
                this.reemet(evenement);
            }
        });
    }

}
