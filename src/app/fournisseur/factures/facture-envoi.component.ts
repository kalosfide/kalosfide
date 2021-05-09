import { OnInit, OnDestroy, Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFDocComponent } from 'src/app/modeles/c-l-f/c-l-f-doc.component';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { PageDef } from 'src/app/commun/page-def';
import { FacturePages } from './facture-pages';
import { CLFUtile } from 'src/app/modeles/c-l-f/c-l-f-utile';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FactureEnvoiComponent extends CLFDocComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FacturePages.envoi;

    get titre(): string {
        return `${this.pageDef.titre} ${this.texteUtileDoc.le_doc}`;
    }

    get utile(): CLFUtile {
        return this.service.utile;
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
