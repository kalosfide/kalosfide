import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfInput } from './kf-input';
import { KfInputNombre } from './kf-input-nombre';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfInputDateTemps } from './kf-input-date-temps';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';
import { KfInputTexte } from './kf-input-texte';
import { KfTypeDInput } from './kf-type-d-input';

@Component({
    selector: 'app-kf-input',
    templateUrl: './kf-input.component.html',
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfInputComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef;
    @ViewChild('labelElement', {static: false}) labelElement: ElementRef;

    typeDInput = KfTypeDInput;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get input(): KfInput {
        return this.composant as KfInput;
    }

    get avecInvalidFeedbak(): boolean {
        console.log(this.composant);
        return this.composant.avecInvalidFeedback;
    }

    get estNombre(): boolean {
        return this.input.typeDInput === KfTypeDInput.nombre;
    }

    get estTexte(): boolean {
        return this.input.typeDInput === KfTypeDInput.texte
            || this.input.typeDInput === KfTypeDInput.email
            || this.input.typeDInput === KfTypeDInput.password;
    }

    get estDateTemps(): boolean {
        return this.input.typeDInput === KfTypeDInput.date
            || this.input.typeDInput === KfTypeDInput.datetemps
            || this.input.typeDInput === KfTypeDInput.temps;
    }

    get nombre(): KfInputNombre {
        if (this.estNombre) {
            return this.composant as KfInputNombre;
        }
    }

    get texte(): KfInputTexte {
        if (this.estTexte) {
            return this.composant as KfInputTexte;
        }
    }

    get dateTemps(): KfInputDateTemps {
        if (this.estDateTemps) {
            return this.composant as KfInputDateTemps;
        }
    }

    get contenuPhrase(): KfContenuPhrase {
        if (this.input.contenuPhrase.contenus.length > 0) {
            return this.input.contenuPhrase;
        }
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.inputElement.nativeElement, this.output);
    }

}
