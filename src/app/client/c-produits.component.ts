import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ProduitIndexBaseComponent } from '../modeles/catalogue/produit-index-base.component';
import { ActivatedRoute } from '@angular/router';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { ClientPages } from './client-pages';
import { BarreTitre, IBarreDef } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';

@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
})
export class CProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = ClientPages.produits;

    get titre(): string {
        return this.pageDef.titre;
    }
    niveauTitre = 0;

    barre: BarreTitre;

    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre(this.barreTitreDef);
        barre.ajoute(Fabrique.titrePage.groupeDefAccès('client'));
        this.barre = barre;
        return barre;
    }

    protected get barreTitreDef(): IBarreDef {
        const def = this._barreTitreDef;
        def.boutonsPourBtnGroup = [[]];
        return def;
    }

    protected contenuAidePage = (): KfComposant[] => {
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

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.aprèsChargeData = () => {
            this.barre.site = this.service.navigation.litSiteEnCours();
            this.barre.rafraichit();
        };
    }

}
