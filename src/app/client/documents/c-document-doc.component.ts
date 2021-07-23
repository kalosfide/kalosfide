import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ActivatedRoute } from '@angular/router';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { CLFDocComponent } from 'src/app/modeles/c-l-f/c-l-f-doc.component';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { ClientCLFService } from '../client-c-l-f.service';

@Component({ template: '' })
export abstract class CDocumentDocComponent extends CLFDocComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
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
            contenuAidePage: this.contenuAidePage(),
            groupesDeBoutons: [groupe]
        });

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    protected get modeActionInitial(): ModeAction {
        return ModeAction.aperçu;
    }

    protected créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[] {
        const colonneDefs = this.utile.colonne.ligne.defsDocument(this.clfDoc);
        return colonneDefs;
    }
}
