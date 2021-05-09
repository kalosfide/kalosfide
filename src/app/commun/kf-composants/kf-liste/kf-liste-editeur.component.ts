import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfListe } from './kf-liste';
import { KfEvenement } from '../kf-partages/kf-evenements';
import { KfListeEditions } from './kf-liste-editions';
import { KfListeEditeur } from './kf-liste-editeur';
import { Router, ActivatedRoute } from '@angular/router';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-liste-editeur',
    templateUrl: './kf-liste-editeur.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfListeEditeurComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', { static: false }) htmlElement: ElementRef;

    test: any;

    _itemEdité: object;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        protected service: TraiteKeydownService) {
        super(service);
    }

    get editeur(): KfListeEditeur {
        return this.composant as KfListeEditeur;
    }

    get itemEdite(): object {
        return this.editeur.itemEdité;
    }

    get editions(): KfListeEditions {
        return this.editeur.editions;
    }

    get liste(): KfListe {
        return this.editeur.editions.liste;
    }

    ngOnInit() {
        console.log(this.editeur);
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.htmlElement.nativeElement, this.output);
    }

    traiteOkAnnuler(evenement: KfEvenement) {
        const idAvant = this.liste.idEdition;
        if (evenement.emetteur === this.editeur.boutonOk) {
            this.editeur.traiteOk(evenement);
        } else {
            this.editeur.traiteAnnuler(evenement);
        }
        if (this.liste.avecLiens) {
            const id = this.liste.idEdition;
            if (id !== idAvant) {
                if (id) {
                    this.router.navigate(['../' + id.toString()], { relativeTo: this.route });
                } else {
                    this.router.navigate(['..'], { relativeTo: this.route });
                }
            }
        }
    }

}
