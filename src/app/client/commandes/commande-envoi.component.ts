import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PageDef } from 'src/app/commun/page-def';
import { ClientCLFService } from '../client-c-l-f.service';
import { CommandeComponent } from './commande.component';
import { CommandePages } from './commande-pages';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CommandeEnvoiComponent extends CommandeComponent implements OnInit, OnDestroy {

    pageDef: PageDef = CommandePages.envoi;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [this.utile.bouton.btnGroupeDefAnnulerVérifier()]
        });
        this.barre = barre;
        return barre;
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.envoi;
    }

    protected créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[] {
        const colonneDefs = this.utile.colonne.ligne.defsDocument(this.clfDoc);
        return colonneDefs;
    }
}
