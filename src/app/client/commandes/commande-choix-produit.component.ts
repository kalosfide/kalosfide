import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClientCLFService } from '../client-c-l-f.service';
import { PageDef } from 'src/app/commun/page-def';
import { CommandePages } from './commande-pages';
import { CLFChoixProduitComponent } from 'src/app/modeles/c-l-f/c-l-f-choix-produit.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class CommandeChoixProduitComponent extends CLFChoixProduitComponent implements OnInit, OnDestroy {
    pageDef: PageDef = CommandePages.choixProduit;

    get titre(): string {
        return `${this.service.utile.texte.commande.def.Doc} n° ${this.clfDoc.no} - ${this.pageDef.titre}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }

}
