import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { LivraisonPages } from './livraison-pages';
import { LivraisonBonComponent } from './livraison-bon.component';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class LivraisonBonNouveauComponent extends LivraisonBonComponent implements OnInit, OnDestroy {

    pageDef: PageDef = LivraisonPages.nouveau;

    get titre(): string {
        return this.pageDef.titre;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.doitCréer;
    }

    protected créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[] {
        const colonneDefs = this.utile.colonne.ligne.defsDocument(this.clfDoc);
        return colonneDefs;
    }
}
