import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { LivraisonPages } from './livraison-pages';
import { CLFLigneComponent } from 'src/app/modeles/c-l-f/c-l-f-ligne.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class LivraisonLigneAjouteComponent extends CLFLigneComponent implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {
    pageDef: PageDef = LivraisonPages.ajoute;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, service, peutQuitterService);
        this.ajout = true;
    }
}
