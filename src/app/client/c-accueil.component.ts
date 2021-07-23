import { Component, OnInit } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ClientPages } from './client-pages';
import { IBarreTitre } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { Site } from '../modeles/site/site';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { ActivatedRoute } from '@angular/router';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { ClientCLFService } from './client-c-l-f.service';
import { IdEtatSite } from '../modeles/etat-site';
import { KfBootstrap } from '../commun/kf-composants/kf-partages/kf-bootstrap';
import { GroupeBoutonsMessages } from '../disposition/fabrique/fabrique-formulaire';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class CAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = ClientPages.accueil;

    site: Site;

    vientDOuvrir: boolean;
    alerteFermé: KfGroupe;
    alerteRéouvert: KfGroupe;

    get titre(): string {
        return this.site.titre;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super();
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            groupesDeBoutons: [Fabrique.titrePage.groupeDefAccès('client')]
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

    private rafraichit() {
        this.barre.site = this.service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    protected créeContenus() {
        const alerte: (état: IdEtatSite) => KfGroupe = (état: IdEtatSite) => {
            const textesEtatSite = this.service.clientUtile.textesEtatSite(état);
            const messages: KfEtiquette[] = [];
            let étiquette: KfEtiquette;
            étiquette = Fabrique.ajouteEtiquetteP(messages);
            étiquette.fixeTextes(textesEtatSite.titre);
            étiquette.ajouteClasse(KfBootstrap.classeTexte({ poids: 'bold' }));
            const defs = textesEtatSite.textes.map(t => ({ texte: t, suiviDeSaut: true }));
            étiquette = Fabrique.ajouteEtiquetteP(messages);
            étiquette.fixeTextes(...defs);
            let boutons: KfBouton[];
            const g = new GroupeBoutonsMessages('alerte_' + état, { messages, boutons })
            return g.groupe;
        }
        this.superGroupe = new KfSuperGroupe(this.nom);
        const titre = new KfEtiquette('titre', this.titre);
        titre.baliseHtml = KfTypeDeBaliseHTML.h4;
        this.superGroupe.ajoute(titre);
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(
            () => {
                this.site = this.service.navigation.litSiteEnCours();
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.créeContenus();
                this.rafraichit();
            })
        );
    }

}
