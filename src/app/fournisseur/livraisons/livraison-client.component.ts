import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurPages } from '../fournisseur-pages';
import { SiteService } from 'src/app/modeles/site/site.service';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CLFClientComponent } from 'src/app/modeles/c-l-f/c-l-f-client.component';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
/** page titre */
export class LivraisonClientComponent extends CLFClientComponent implements OnInit, OnDestroy {

    pageDef: PageDef = FournisseurPages.livraison;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
        protected siteService: SiteService,
    ) {
        super(route, service, siteService);
    }

    protected contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Commander consiste à choisir des produits et à fixer les quantités demandées. `
            + `Traiter une commande consiste à fixer la quantité à livrer de chaque produit demandé.`);

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Pour les commandes créées par un client, `,
            { texte: 'Supprimer', balise: KfTypeDeBaliseHTML.b },
            ' est remplacé par ',
            { texte: 'Exclure', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Refuser une commande consiste à fixer à 0 les quantités à livrer des produits demandés.`
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Quand vous créez une ligne, il n'est pas nécessaire de fixer la quantité demandée.`
        );

        return infos;
    }

}
