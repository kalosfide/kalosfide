import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ProduitIndexBaseComponent } from '../modeles/catalogue/produit-index-base.component';
import { ActivatedRoute, Data } from '@angular/router';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { ClientPages } from './client-pages';
import { IBarreTitre, IBarreDef } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { IPageTableDef } from '../disposition/page-table/i-page-table-def';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class CProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = ClientPages.catalogue;

    get titre(): string {
        return this.pageDef.titre;
    }
    niveauTitre = 0;


    constructor(
        protected route: ActivatedRoute,
        protected service: ProduitService,
    ) {
        super(route, service);
    }

    créeBarreTitre = (): IBarreTitre => {
        this.barreTitreDef.groupesDeBoutons = [Fabrique.titrePage.groupeDefAccès('client')]
        const barre = Fabrique.titrePage.barreTitre(this.barreTitreDef);
        this.barre = barre;
        return barre;
    }

    protected get barreTitreDef(): IBarreDef {
        const def = this._barreTitreDef;
        return def;
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => {
                this.barre.site = this.service.navigation.litSiteEnCours();
                this.barre.rafraichit();
            }
        };
    }

}
