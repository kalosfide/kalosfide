import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { KfTable } from './kf-table-composant';

@Component({
    selector: 'app-kf-table',
    templateUrl: './kf-table.component.html',
    styleUrls: ['../kf-composants.scss']
})

export class KfTableComponent extends KfComposantComponent implements OnInit, AfterViewInit {
    @ViewChild('htmlElement', {static: false}) domElementRef: ElementRef;

    get table(): KfTable {
        return this.composant as KfTable;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.composant.initialiseHtml(this.domElementRef.nativeElement, this.output);
    }
}
