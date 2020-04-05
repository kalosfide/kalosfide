import { OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { CLFDocComponent } from 'src/app/modeles/c-l-f/c-l-f-doc.component';
import { ModeAction } from 'src/app/modeles/c-l-f/condition-action';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';

export abstract class FDocumentDocComponent extends CLFDocComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }

    get titre(): string {
        return `${this.utile.texte.textes(this.clfDoc.type).def.Doc} n° ${this.clfDoc.no} - ${this.clfDoc.client.nom}`;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.retourDeDocument(this.clfDoc)]]
        });

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
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
