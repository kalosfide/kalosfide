import { ActivatedRoute } from '@angular/router';
import { Site } from 'src/app/modeles/site/site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { FSitePages, FSiteRoutes } from './f-site-pages';
import { KeyUidRnoALESComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-ales.component';
import { SiteEditeur } from 'src/app/modeles/site/site-editeur';

export abstract class SiteALESComponent extends KeyUidRnoALESComponent<Site> {

    site: null;

    dataPages = FSitePages;
    dataRoutes = FSiteRoutes;

    constructor(
        protected route: ActivatedRoute,
        protected service: SiteService,
    ) {
        super(route, service);
    }

    créeDataEditeur()  {
        this.dataEditeur = new SiteEditeur(this);
    }
}
