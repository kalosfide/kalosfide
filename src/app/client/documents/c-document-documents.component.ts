import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { CLFDocsComponent } from 'src/app/modeles/c-l-f/c-l-f-docs.component';
import { ClientCLFService } from '../client-c-l-f.service';
import { CDocumentPages } from './c-document-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class CDocumentDocumentsComponent extends CLFDocsComponent implements OnInit, OnDestroy {

    pageDef: PageDef = CDocumentPages.liste;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }

    get titre(): string {
        return this.pageDef.titre;
    }

    protected contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }
}
