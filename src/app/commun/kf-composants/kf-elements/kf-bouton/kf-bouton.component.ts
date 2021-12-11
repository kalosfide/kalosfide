import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation
} from '@angular/core';
import { KfBouton } from './kf-bouton';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-bouton',
    templateUrl: './kf-bouton.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfBoutonComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) htmlElementRef: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.htmlElementRef.nativeElement, this.output);
    }

    get button(): HTMLButtonElement {
        return this.htmlElementRef.nativeElement;
    }

    get bouton(): KfBouton {
        return this.composant as KfBouton;
    }

    get inactif(): boolean {
        switch (this.bouton.typeDeBouton) {
            case 'button':
                return this.bouton.inactif;
            case 'reset':
                return this.bouton.formulaire ? this.bouton.formulaire.formGroup.pristine : false;
            case 'submit':
                return !this.bouton.formulaire.peutSoumettre;
            default:
                break;
        }
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.bouton.contenuPhrase;
    }

}
