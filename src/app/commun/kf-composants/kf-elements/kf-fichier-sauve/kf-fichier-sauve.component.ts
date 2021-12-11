import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { KfFichierSauve } from './kf-fichier-sauve';
import { TraiteKeydownService } from '../../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-fichier-sauve',
    template: `
        <a #baliseElement [download]="fichier.nomFichier" [href]="dataUrl" [ngClass]="fichier.classe"
            [ngStyle]="fichier.style">
            <app-kf-contenu-phrase  [contenuPhrase]="fichier.contenuPhrase"></app-kf-contenu-phrase>
        </a>
`,
    styleUrls: ['../../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfFichierSauveComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('baliseElement', {static: false}) baliseElementRef: ElementRef;

    constructor(private sanitizer: DomSanitizer,
                protected service: TraiteKeydownService) {
            super(service);
        }

    get fichier(): KfFichierSauve { return this.composant as KfFichierSauve; }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.baliseElementRef.nativeElement, this.output);
    }

    get dataUrl(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.fichier.dataUrl);
    }

}
