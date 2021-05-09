import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { ClientCLFService } from '../client-c-l-f.service';
import { CommandeComponent } from './commande.component';
import { CommandePages } from './commande-pages';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CommandeBonComponent extends CommandeComponent implements OnInit, OnDestroy {

    pageDef: PageDef = CommandePages.lignes;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }

    get titre(): string {
        return `${this.utile.texte.commande.def.Doc} n° ${this.clfDoc.no}`;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
        });

        barre.ajoute(this.utile.bouton.btnGroupeDefVérifier());

        this.barre = barre;
        return barre;
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.edite;
    }
}
