import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { FormulaireAEtapesComponent } from '../../disposition/formulaire/formulaire-a-etapes.component';
import { ApiResult } from '../../commun/api-results/api-result';

import { FournisseurEditeur } from '../../fournisseur/fournisseur';
import { DevenirFournisseurModel } from './devenir-fournisseur-model';
import { PageDef } from 'src/app/commun/page-def';
import { FormulaireAEtapeService } from 'src/app/disposition/formulaire/formulaire-a-etapes.service';
import { DevenirFournisseurPages, DevenirFournisseurRoutes } from './devenir-fournisseur-pages';
import { ReglesDeMotDePasse } from 'src/app/securite/mot-de-passe/mot-de-passe';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { AppSite } from 'src/app/app-site/app-site';
import { AppSitePages } from '../app-site-pages';
import { DevenirConnectionEditeur } from 'src/app/compte/devenir/devenir-connection-model';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { SiteEditeur } from 'src/app/modeles/site/site-editeur';
import { CompteService } from 'src/app/compte/compte.service';

@Component({
    templateUrl: '../../disposition/formulaire/formulaire-a-etapes.component.html',
    styleUrls: ['../../commun/commun.scss']
})
export class DevenirFournisseurComponent extends FormulaireAEtapesComponent implements OnInit, OnDestroy, ComponentAAutoriserAQuitter {

    pageDef: PageDef = AppSitePages.devenirFournisseur;

    get titre(): string {
        return `${AppSite.titre} - ${this.pageDef.titre}`;
    }

    créeBoutonsDeFormulaire = () => [Fabrique.bouton.boutonSoumettre(this.formulaire, `S'enregistrer`)];

    apiDemande = (): Observable<ApiResult> => {
        const valeur = this.valeur;
        const model = new DevenirFournisseurModel();
        model.email = valeur.email;
        model.password = valeur.password;
        model.copieData(valeur);
        console.log(model);
        return this.service.enregistreFournisseur(model);
    }

    actionSiOk = (): void => {
        const identifiant = this.identification.litIdentifiant();
        this.routeur.naviguePageDef(FournisseurPages.accueil, FournisseurRoutes, identifiant.nomSiteParDéfaut);
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
        protected etapesService: FormulaireAEtapeService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(service, etapesService, peutQuitterService);

        this.titreRésultatErreur = 'Enregistrement impossible';
        this.titreRésultatSucces = 'Enregistrement réussi.';
        this.ajouteEtape(DevenirFournisseurPages.connection, new DevenirConnectionEditeur());
        this.ajouteEtape(DevenirFournisseurPages.profil, new FournisseurEditeur());
        this.ajouteEtape(DevenirFournisseurPages.site, new SiteEditeur(this));
        const contenus = this.contenusValidationParDéfaut();
        this.ajouteEtape(DevenirFournisseurPages.validation, { créeContenus() { return contenus; } });
    }

    ngOnInit() {
        this.route.data.subscribe((data: { motDePasse: ReglesDeMotDePasse }) => {
            this.créeFormulaire();
            const éditeur = this.etapes[0].éditeur as DevenirConnectionEditeur;
            éditeur.kfTexteDuMotDePasse.gereValeur.FixeValidateurs(ReglesDeMotDePasse.créeValidateurs(data.motDePasse));
        });
        this.ngOnInit_Index();
    }


    construitUrl(routeEtape: string): string {
        return DevenirFournisseurRoutes.url(routeEtape);
    }

}
