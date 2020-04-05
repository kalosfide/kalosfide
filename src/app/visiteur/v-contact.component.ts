import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { VisiteurPages } from './visiteur-pages';
import { SiteContactComponent } from '../site/site-contact.component';

@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
})
export class VContactComponent extends SiteContactComponent implements OnInit {

    static sPageDef: PageDef = VisiteurPages.contact;
    pageDef: PageDef = VisiteurPages.contact;

    constructor(
        protected service: NavigationService,
    ) {
        super(service);
    }

}
