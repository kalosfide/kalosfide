import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { ClientCLFService } from '../client-c-l-f.service';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { CommandePages } from './commande-pages';
import { CLFLigneAjouteComponent } from 'src/app/modeles/c-l-f/c-l-f-ligne.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CommandeLigneAjouteComponent extends CLFLigneAjouteComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {

    pageDef: PageDef = CommandePages.ajoute;

    get titre(): string {
        return `${this.service.utile.texte.commande.def.Doc} n° ${this.clfDoc.no} - ${this.pageDef.titre}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, service, peutQuitterService);
    }
}
