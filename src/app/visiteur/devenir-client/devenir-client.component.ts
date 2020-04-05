import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { FormulaireAEtapesComponent } from '../../disposition/formulaire/formulaire-a-etapes.component';
import { ApiResult } from '../../commun/api-results/api-result';
import { DevenirClientModel } from './devenir-client-model';
import { NavigationService } from 'src/app/services/navigation.service';
import { PageDef } from 'src/app/commun/page-def';
import { FormulaireAEtapeService } from 'src/app/disposition/formulaire/formulaire-a-etapes.service';
import { DevenirClientPages, DevenirClientRoutes } from './devenir-client-pages';
import { Site } from 'src/app/modeles/site/site';
import { DevenirConnectionEditeur } from 'src/app/compte/devenir/devenir-connection-model';
import { ReglesDeMotDePasse } from 'src/app/securite/mot-de-passe/mot-de-passe';
import { VisiteurPages } from 'src/app/visiteur/visiteur-pages';
import { ClientRoutes, ClientPages } from 'src/app/client/client-pages';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ClientEditeur } from 'src/app/modeles/client/client-editeur';
import { CompteService } from 'src/app/compte/compte.service';

@Component({
    templateUrl: '../../disposition/formulaire/formulaire-a-etapes.component.html',
    styleUrls: ['../../commun/commun.scss']
})
export class DevenirClientComponent extends FormulaireAEtapesComponent implements OnInit {

    static sPageDef: PageDef = VisiteurPages.devenirClient;
    pageDef: PageDef = VisiteurPages.devenirClient;

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    créeBoutonsDeFormulaire = () => [Fabrique.bouton.boutonSoumettre(this.formulaire, `S'enregistrer`)];

    apiDemande = (): Observable<ApiResult> => {
        const valeur = this.valeur;
        const model = new DevenirClientModel();
        model.email = valeur.email;
        model.password = valeur.password;
        model.siteUid = this.site.uid;
        model.siteRno = this.site.rno;
        model.copieData(valeur);
        console.log(model);
        return (this.service as CompteService).enregistreClient(model);
    }

    actionSiOk = (): void => {
        const site = this.navigationService.litSiteEnCours();
        this.routeur.naviguePageDef(ClientPages.accueil, ClientRoutes, site.nomSite);
    }

    constructor(
        protected navigationService: NavigationService,
        protected route: ActivatedRoute,
        service: CompteService,
        protected etapesService: FormulaireAEtapeService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(service, etapesService, peutQuitterService);

        this.titreRésultatErreur = 'Enregistrement impossible';
        this.titreRésultatSucces = 'Enregistrement réussi.';
        this.ajouteEtape(DevenirClientPages.connection, new DevenirConnectionEditeur());
        this.ajouteEtape(DevenirClientPages.profil, new ClientEditeur(this));
        const contenus = this.contenusValidationParDéfaut();
        this.ajouteEtape(DevenirClientPages.validation, { créeContenus() { return contenus; } });
    }

    construitUrl(routeEtape: string): string {
        return DevenirClientRoutes.url(this.site.nomSite, routeEtape);
    }

    ngOnInit() {
        this.site = this.navigationService.litSiteEnCours();
        this.route.data.subscribe((data: { motDePasse: ReglesDeMotDePasse }) => {
            this.créeFormulaire();
            const éditeur = this.etapes[0].éditeur as DevenirConnectionEditeur;
            éditeur.kfTexteDuMotDePasse.gereValeur.FixeValidateurs(ReglesDeMotDePasse.créeValidateurs(data.motDePasse));
        });
        this.ngOnInit_Index();
    }

}
