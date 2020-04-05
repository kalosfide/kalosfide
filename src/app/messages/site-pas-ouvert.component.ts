import { Component } from '@angular/core';
import { PageMessageComponent } from '../disposition/page-message/page-message.component';
import { PageDef } from 'src/app/commun/page-def';
import { AppPages } from '../app-pages';

@Component({
    templateUrl: '../disposition/page-message/page-message.component.html',
    styleUrls: ['../commun/commun.scss']
})
export class SitePasOuvertComponent extends PageMessageComponent {

    static sPageDef: PageDef = AppPages.pasOuvert;
    pageDef: PageDef = AppPages.pasOuvert;

    messages = [
        'Le site est actuellement fermé.',
        'Veuillez réessayer ultérieurement.'
    ];

    constructor() {
        super();
    }

}
