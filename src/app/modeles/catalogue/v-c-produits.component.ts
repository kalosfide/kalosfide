import { Component, OnInit, OnDestroy } from '@angular/core';
import { SitePages } from 'src/app/site/site-pages';
import { ProduitIndexBaseComponent } from './produit-index-base.component';
import { PageDef } from 'src/app/commun/page-def';
import { BarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ActivatedRoute } from '@angular/router';
import { ProduitService } from './produit.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html', styleUrls: ['../../commun/commun.scss']
})
export class VCProduitsComponent extends ProduitIndexBaseComponent implements OnInit, OnDestroy {

    pageDef: PageDef = SitePages.catalogue;

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

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.aprèsChargeData = () => {
            this.barre.site = this.service.navigation.litSiteEnCours();
            this.barre.rafraichit();
        };
    }

}
