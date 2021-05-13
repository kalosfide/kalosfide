import { OnInit, OnDestroy, Directive } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { CLFDocComponent } from 'src/app/modeles/c-l-f/c-l-f-doc.component';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';

@Directive()
export abstract class LivraisonBonComponent extends CLFDocComponent implements OnInit, OnDestroy {

    get titre(): string {
        return `${this.utile.texte.livraison.def.Bon}${this.clfDoc.no !== 0
            ? ' n° ' + this.clfDoc.no
            : ' virtuel'}${this.pageDef.titre ? ' - ' + this.pageDef.titre : ''}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(route, service);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.retourDeBon(this.clfDoc)]]
        });

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
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
        const colonneDefs = this.utile.colonne.ligne.defsFournisseur(this.clfDoc, this.quandLigneSupprimée.bind(this));
        return colonneDefs;
    }
}
