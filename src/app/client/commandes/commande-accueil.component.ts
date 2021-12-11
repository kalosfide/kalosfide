import { Component, OnInit } from '@angular/core';

import { PageDef } from 'src/app/commun/page-def';
import { ClientCLFService } from '../client-c-l-f.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { ClientPages } from '../client-pages';
import { CLFTitreComponent } from 'src/app/modeles/c-l-f/c-l-f-titre.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
// Page titre de la section commande
export class CommandeAccueilComponent extends CLFTitreComponent implements OnInit {

    pageDef: PageDef = ClientPages.commandes;

    constructor(
        protected service: ClientCLFService,
    ) {
        super(service);
        this.estClient = 'client';
    }

    protected contenuAidePage: () => KfComposant[] = () => {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est encore plus `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

}
