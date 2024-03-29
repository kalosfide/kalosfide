import { ActivatedRoute } from '@angular/router';
import { Site } from 'src/app/modeles/site/site';
import { SiteService } from 'src/app/modeles/site/site.service';
import { FSitePages } from './f-site-pages';
import { KeyIdALESComponent } from 'src/app/commun/data-par-key/key-id/key-id-ales.component';
import { SiteEditeur } from 'src/app/modeles/site/site-editeur';
import { Component } from "@angular/core";

@Component({ template: '' })
export abstract class SiteALESComponent extends KeyIdALESComponent<Site> {

    site: null;

    dataPages = FSitePages;

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
