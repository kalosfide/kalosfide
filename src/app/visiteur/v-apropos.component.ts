import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { VisiteurPages } from './visiteur-pages';
import { SiteAProposComponent } from '../site/site-apropos.component';

@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
})
export class VAProposComponent extends SiteAProposComponent implements OnInit {
    pageDef: PageDef = VisiteurPages.apropos;

    constructor(
        protected service: NavigationService,
    ) {
        super(service);
    }

}
