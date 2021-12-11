import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation
} from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfListe } from './kf-liste';
import { KfEvenement, KfTypeDEvenement } from '../kf-partages/kf-evenements';
import { KfListeEditions } from './kf-liste-editions';
import { KfListeSelecteurs } from './kf-liste-selecteurs';
import { KfListeCommandes } from './kf-liste-commandes';
import { Router, ActivatedRoute } from '@angular/router';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-liste',
    templateUrl: './kf-liste.component.html',
    styleUrls: ['../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfListeComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) htmlElement: ElementRef;

    test: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        protected service: TraiteKeydownService) {
        super(service);
    }

    get liste(): KfListe {
        return this.composant as KfListe;
    }

    get editions(): KfListeEditions {
        return this.liste.editions;
    }

    get commandes(): KfListeCommandes {
        return this.liste.commandes;
    }

    get selecteurs(): KfListeSelecteurs {
        return this.liste.selecteurs;
    }

    get ids(): number[] {
        return this.liste.items.map(i => this.liste.creeItems.id(i));
    }

    get editionEnCours(): boolean {
        return this.editions.editeur.editionEnCours;
    }

    ngOnInit() {
        if (!this.editions.editeur) {
            this.liste.editions.initialiseAjout();
        }
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.htmlElement.nativeElement, this.output);
    }

    traiteCommande(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.click) {
            const idAvant = this.liste.idEdition;
            this.commandes.traiteClic(evenement.emetteur);
            if (this.liste.avecLiens) {
                const id = this.liste.idEdition;
                if (id !== idAvant) {
                    if (id) {
                        this.router.navigate([id.toString()], { relativeTo: this.route });
                    } else {
                        this.router.navigate(['.'], { relativeTo: this.route });
                    }
                }
            }
        }
    }

}
