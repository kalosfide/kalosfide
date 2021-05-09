import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { PageDef } from '../../commun/page-def';
import { BarreTitre } from '../../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../../disposition/page-base/page-base.component';
import { Site } from '../site/site';
import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { SitePages } from 'src/app/site/site-pages';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class VCModifEnCoursComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = SitePages.pasOuvert;

    site: Site;

    get titre(): string {
        return this.site.titre;
    }

    constructor(
        protected service: NavigationService,
    ) {
        super();
    }

    private rafraichit() {
        this.barre.site = this.service.litSiteEnCours();
        this.barre.rafraichit();
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        const groupe = new KfGroupe('actionImpossible');
        let etiquette: KfEtiquette;
        groupe.ajouteClasse('alert alert-warning');

        etiquette = new KfEtiquette(''
        );
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        Fabrique.ajouteTexte(etiquette,
            `Le catalogue du site `,
            { texte: `${this.site.titre}`, balise: KfTypeDeBaliseHTML.i },
            ` est inaccessible car il est en cours de modification.`
        );
        groupe.ajoute(etiquette);

        etiquette = new KfEtiquette('', 'Veuillez réessayer ultérieurement.');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        this.superGroupe.ajoute(groupe);
    }

    ngOnInit() {
        this.site = this.service.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
        this.rafraichit();
    }

}
