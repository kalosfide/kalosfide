import { Component, OnInit } from '@angular/core';
import { Site } from '../modeles/site/site';
import { NavigationService } from '../services/navigation.service';
import { PageDef } from '../commun/page-def';
import { FournisseurPages, FournisseurRoutes } from './fournisseur-pages';
import { BarreTitre } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { FabriqueBootstrap } from '../disposition/fabrique/fabrique-bootstrap';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { IdEtatSite } from '../modeles/etat-site';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from '../commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';



@Component({
    templateUrl: '../disposition/page-base/page-base.html', styleUrls: ['../commun/commun.scss']
})
export class FAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = FournisseurPages.accueil;

    site: Site;
    barre: BarreTitre;

    grAlerteEtatSite: KfGroupe;
    texteEtat: KfTexte;
    infoPopover: KfBouton;
    lien: KfLien;

    constructor(
        protected service: NavigationService,
    ) {
        super();
    }

    get titre(): string {
        return this.site.titre;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        barre.ajoute(Fabrique.titrePage.groupeDefAccès());

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    private créeGroupeEtatSite(): KfGroupe {
        const groupe = new KfGroupe('etatSite');

        const titre = Fabrique.titrePage.titrePage(Fabrique.etatSite.titre, 1);
        groupe.ajoute(titre);

        let etiquette: KfEtiquette;

        if (this.site.etat !== IdEtatSite.ouvert) {
            const étatSite = Fabrique.etatSite.état(this.site.etat);
            const grAlerte = new KfGroupe('');
            FabriqueBootstrap.ajouteClasse(grAlerte, 'alert', 'danger');
            grAlerte.créeDivTable();
            const ligne = grAlerte.divTable.ajoute();
            ligne.ajouteClasseDef('row');

            etiquette = new KfEtiquette('');
            Fabrique.ajouteTexte(etiquette,
                `Etat du site: `,
                { texte: étatSite.nom, balise: KfTypeDeBaliseHTML.b }
            );
            let col = ligne.ajoute(etiquette);
            col.ajouteClasseDef('col');

            etiquette = new KfEtiquette('');
            Fabrique.ajouteTexte(etiquette,
                ` Pour arrêter ${étatSite.article_titre},`
            );
            const lien = Fabrique.lien.lienEnLigne({
                urlDef: {
                    pageDef: étatSite.pageDef,
                    routes: FournisseurRoutes,
                    nomSite: this.site.nomSite
                }
            });
            etiquette.contenuPhrase.ajoute(lien);
            col = ligne.ajoute(etiquette);
            col.ajouteClasseDef('col');

            groupe.ajoute(grAlerte);
        }

        etiquette = new KfEtiquette('');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        etiquette.fixeTexte(Fabrique.etatSite.intro);
        groupe.ajoute(etiquette);

        const vueTable = Fabrique.vueTable.vueTable('etats', Fabrique.etatSite.vueTableDef, null);
        vueTable.initialise(Fabrique.etatSite.états);
        groupe.ajoute(vueTable);
        return groupe;
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(this.créeGroupeEtatSite());
        const titre = new KfEtiquette('titre', this.titre);
        titre.baliseHtml = KfTypeDeBaliseHTML.h4;
        this.superGroupe.ajoute(titre);
    }

    private rafraichit() {
        this.barre.site = this.service.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this.service.litSiteEnCours();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
        this.rafraichit();
    }

}
