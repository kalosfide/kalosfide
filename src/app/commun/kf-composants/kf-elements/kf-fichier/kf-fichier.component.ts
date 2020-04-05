import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { KfFichier } from './kf-fichier';
import { KfComposantComponent } from '../../kf-composant/kf-composant.component';
import { KfTypeDEvenement, KfStatutDEvenement, KfEvenement } from '../../kf-partages/kf-evenements';
import { KFComposantService } from '../../kf-composant.service';

@Component({
    selector: 'app-kf-fichier',
    template: `
    <label #labelElement [attr.for]="fichier.nom" [ngClass]="fichier.classe" [ngStyle]="fichier.style">
        <app-kf-contenu-phrase *ngIf="fichier.contenuPhrase"  [contenuPhrase]="fichier.contenuPhrase"></app-kf-contenu-phrase>
        <input
            #inputElement
            [id]="fichier.nom"
            type="file"
            [attr.accept]="fichier.typesAcceptes"
            [attr.multiple]="fichier.multiple ? '' : undefined"
            (change)="quandChange()"
            [style.display]="fichier.inputVisible ? 'inline-block' : 'none'"
        />
    </label>
    <!--
    -->
`,
    styleUrls: ['../../kf-composants.scss']
})
export class KfFichierComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef;
    @ViewChild('labelElement', {static: false}) labelElement: ElementRef;

    test: any;

    file: File;

    constructor(protected service: KFComposantService) {
        super(service);
    }

    ngOnInit() {
        this.test = this.fichier.formControl === undefined;
    }

    ngAfterViewInit() {
        this.composant.gereHtml.htmlElement = this.labelElement.nativeElement;
        this.composant.gereHtml.enfantsDeVue = {
            inputElement: this.inputElement.nativeElement,
            labelElement: this.labelElement.nativeElement,
        };
        this.composant.gereHtml.initialiseHtml(this.output);
        const inputElement = this.inputElement.nativeElement as HTMLInputElement;
    }

    get fichier(): KfFichier { return this.composant as KfFichier; }

    quandChange() {
        const files: FileList = (this.inputElement.nativeElement as HTMLInputElement).files;
        this.fichier.files = [];
        for (let i = 0; i < files.length; i++) {
            this.fichier.files.push(files[i]);
        }
        const evenement = new KfEvenement(this.composant, KfTypeDEvenement.fichiersChoisis, files);
        this.output.emit(evenement);
    }

}
