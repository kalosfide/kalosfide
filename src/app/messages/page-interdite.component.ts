import { Component } from '@angular/core';
import { PageMessageComponent } from '../disposition/page-message/page-message.component';
import { PageDef } from 'src/app/commun/page-def';
import { AppPages } from 'src/app/app-pages';

@Component({
    templateUrl: '../disposition/page-message/page-message.component.html',
    styleUrls: ['../commun/commun.scss']
})
export class PageInterditeComponent extends PageMessageComponent {

    static sPageDef: PageDef = AppPages.interdit;
    pageDef: PageDef = AppPages.interdit;

    messages: ['L\'accès à ces ressources est réservé.'];

    constructor() {
        super();
    }

}
