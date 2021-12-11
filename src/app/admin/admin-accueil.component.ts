import { Component, OnInit } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { IBarreTitre } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { Identifiant } from '../securite/identifiant';
import { AppSite } from '../app-site/app-site';
import { AdminPages } from './admin-pages';
import { AdminService } from './admin.service';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AdminAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = AdminPages.accueil;

    constructor(
        private service: AdminService,
    ) {
        super();
    }

    get titre(): string {
        return this.pageDef.titre;
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });
        this.barre = barre;
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

    protected créeContenus() {
        const appRouteur = Fabrique.url.appRouteur;
        this.superGroupe = new KfSuperGroupe(this.nom);
        const titre = new KfEtiquette('titre', 'Bienvenue sur votre site');
        titre.baliseHtml = KfTypeDeBaliseHTML.h6;
        this.superGroupe.ajoute(titre);
    }

    private rafraichit() {
        this.barre.site = this.service.identification.siteEnCours;
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
        this.rafraichit();
    }

}
