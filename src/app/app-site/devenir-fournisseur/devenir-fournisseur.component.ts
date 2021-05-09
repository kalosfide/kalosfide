import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { ApiResult } from '../../api/api-results/api-result';

import { FournisseurModel } from '../../fournisseur/fournisseur';
import { PageDef } from 'src/app/commun/page-def';
import { AppSite } from 'src/app/app-site/app-site';
import { AppSitePages } from '../app-site-pages';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { SiteEditeur } from 'src/app/modeles/site/site-editeur';
import { CompteService } from 'src/app/compte/compte.service';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Identifiant } from 'src/app/securite/identifiant';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { AppPages } from 'src/app/app-pages';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class DevenirFournisseurComponent extends FormulaireComponent implements OnInit, OnDestroy {

    pageDef: PageDef = AppSitePages.devenirFournisseur;


    get titre(): string {
        return this.pageDef.titre;
    }

    identifiant: Identifiant;
    éditeurSite: SiteEditeur;

    texteBoutonSoumettre: () => string;

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, this.texteBoutonSoumettre());
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        const valeur = this.valeur;
        return this.service.créeSite(valeur);
    }

    actionSiOk = (): void => {
        this.routeur.naviguePageDef(FournisseurPages.accueil, FournisseurRoutes, this.éditeurSite.kfUrl.valeur);
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Enregistrement impossible';
        this.titreRésultatSucces = 'Enregistrement réussi.';
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();

        this.éditeurSite = new SiteEditeur(this);
        this.éditeurSite.créeKfDeData();
        this.éditeurSite.kfDeData.forEach(c => groupe.ajoute(c));

        this.texteBoutonSoumettre = () => {
            let texte = `Créer le site`;
            if (this.éditeurSite.kfUrl.valeur && !this.éditeurSite.kfUrl.gereValeur.invalide) {
                texte += ` d'adresse ${AppSite.nom}/${AppPages.site.urlSegment}/${this.éditeurSite.kfUrl.valeur}`;
            }
            return texte;
        };
        this.éditeurSite.kfUrl.gereHtml.suitLaValeur();
        this.éditeurSite.kfUrl.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            () => {
                this.boutonSoumettre.fixeTexte(this.texteBoutonSoumettre());
            });


        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(() => {
            this.niveauTitre = 0;
            this.créeTitrePage();
            this.identifiant = this.identification.litIdentifiant();
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
        }));
    }

}
