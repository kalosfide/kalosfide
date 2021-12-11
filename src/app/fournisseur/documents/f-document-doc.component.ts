import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { CLFDocComponent } from 'src/app/modeles/c-l-f/c-l-f-doc.component';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';

@Component({ template: '' })
export abstract class FDocumentDocComponent extends CLFDocComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }

    get titre(): string {
        return `${this.utile.texte.textes(this.clfDoc.type).def.Doc} n° ${this.clfDoc.no}`;
    }

    créeBarreTitre = (): IBarreTitre => {
        const groupe = Fabrique.titrePage.groupeRetour(this.utile.lien.retourDeDocument(this.clfDoc));
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [groupe]
        });
        return barre;
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.aperçu;
    }

    protected créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[] {
        const colonneDefs = this.utile.colonne.ligne.defsDocument(this.clfDoc);
        return colonneDefs;
    }
}
