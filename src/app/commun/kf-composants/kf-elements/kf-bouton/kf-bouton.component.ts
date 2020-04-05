import {
    Component, OnInit, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';
import { KfBouton } from './kf-bouton';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { FormGroup } from '@angular/forms';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfTypeDeBouton } from '../../kf-composants-types';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-bouton',
    templateUrl: './kf-bouton.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfBoutonComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) htmlElementRef: ElementRef;

    constructor(protected service: KFComposantService) {
        super(service);
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.htmlElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

    get button(): HTMLButtonElement {
        return this.htmlElementRef.nativeElement;
    }

    get bouton(): KfBouton {
        return this.composant as KfBouton;
    }

    get buttonType(): string {
        return 'button';
    }

    get inactif(): boolean {
        const form = this.composant.formulaireParent;
        switch (this.bouton.typeDeBouton) {
            case KfTypeDeBouton.bouton:
                return this.bouton.inactif;
            case KfTypeDeBouton.annuler:
                return false;
            case KfTypeDeBouton.retablir:
                return form ? form.formGroup.pristine : false;
            case KfTypeDeBouton.soumettre:
                return !form || !form.peutSoumettre();
            default:
                break;
        }
    }

    get contenuPhrase(): KfContenuPhrase {
        return this.bouton.contenuPhrase;
    }

}
