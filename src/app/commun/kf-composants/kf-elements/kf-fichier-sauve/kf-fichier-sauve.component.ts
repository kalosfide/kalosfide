import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { KfFichierSauve } from './kf-fichier-sauve';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from '../../kf-partages/kf-evenements';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-fichier-sauve',
    template: `
        <a #baliseElement [download]="fichier.nomFichier" [href]="dataUrl" [ngClass]="fichier.classe"
            [ngStyle]="fichier.style"> (click)="quandClic()">
            <app-kf-contenu-phrase  [contenuPhrase]="fichier.contenuPhrase"></app-kf-contenu-phrase>
        </a>
`,
    styleUrls: ['../../kf-composants.scss']
})
export class KfFichierSauveComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement', {static: false}) baliseElementRef: ElementRef;

    constructor(private sanitizer: DomSanitizer,
                protected service: KFComposantService) {
            super(service);
        }

    get fichier(): KfFichierSauve { return this.composant as KfFichierSauve; }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.baliseElementRef.nativeElement;
        this.composant.gereHtml.initialiseHtml(this.output);
    }

    get dataUrl(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.fichier.dataUrl);
    }

    quandClic() {
        const evenement = new KfEvenement(this.composant, KfTypeDEvenement.fichierSauve);
        this.traiteOuTransmet(evenement);
    }

}
