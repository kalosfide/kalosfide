import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { FacturePages } from './facture-pages';
import { CLFLigneAjouteComponent } from 'src/app/modeles/c-l-f/c-l-f-ligne.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FactureLigneAjouteComponent extends CLFLigneAjouteComponent implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {
    pageDef: PageDef = FacturePages.ajoute;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, service, peutQuitterService);
    }
}
