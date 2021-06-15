import { Component, ViewChild, AfterViewInit, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { KfComposantComponent } from '../kf-composant/kf-composant.component';
import { IKfVueTable } from './kf-vue-table';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-kf-vue-table',
    templateUrl: './kf-vue-table.component.html',
    styleUrls: ['../kf-composants.scss']
})
export class KfVueTableComponent extends KfComposantComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @ViewChild('tableElement', {static: false}) tableElement: ElementRef;

    constructor(protected service: TraiteKeydownService) {
        super(service);
    }

    get vueTable(): IKfVueTable {
        return (this.composant as any) as IKfVueTable;
    }

    get avecOutils(): boolean {
        return !!this.vueTable.outils && !this.vueTable.outils.nePasAfficher;
    }

    get avecPagination(): boolean {
        return !!this.vueTable.pagination && !this.vueTable.pagination.groupe.nePasAfficher;
    }

    ngAfterViewInit() {
        this.vueTable.initialiseHtml(this.tableElement.nativeElement, this.output);
    }

    ngAfterViewChecked() {
        this.vueTable.vérifieHtml();
    }
}
