import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteALESComponent } from './site-ales.component';
import { SiteService } from 'src/app/modeles/site/site.service';
import { PageDef } from 'src/app/commun/page-def';
import { FSitePages } from './f-site-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class SiteEditeComponent extends SiteALESComponent {

    pageDef: PageDef = FSitePages.edite;

    constructor(
        protected route: ActivatedRoute,
        protected service: SiteService,
    ) {
        super(route, service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionEdite();
    }

}
