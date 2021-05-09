import { OnInit, OnDestroy, Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFDocComponent } from 'src/app/modeles/c-l-f/c-l-f-doc.component';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { PageDef } from 'src/app/commun/page-def';
import { LivraisonPages } from './livraison-pages';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class LivraisonEnvoiComponent extends CLFDocComponent implements OnInit, OnDestroy {

    pageDef: PageDef = LivraisonPages.envoi;

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
        return ModeAction.envoi;
    }

    protected créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[] {
        const colonneDefs = this.utile.colonne.ligne.defsDocument(this.clfDoc);
        return colonneDefs;
    }
}
