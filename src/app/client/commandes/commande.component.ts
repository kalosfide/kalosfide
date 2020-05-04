import { OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ClientCLFService } from '../client-c-l-f.service';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { CLFDocComponent } from 'src/app/modeles/c-l-f/c-l-f-doc.component';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';


export abstract class CommandeComponent extends CLFDocComponent implements OnInit, OnDestroy {

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super(route, service);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        return barre;
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

    protected créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[] {
        return this.utile.colonne.ligne.defsClient(this.quandLigneSupprimée.bind(this), this.service.traiteErreur);
    }
}
