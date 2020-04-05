import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CompteService } from '../compte.service';

import { ApiResult } from '../../commun/api-results/api-result';
import { ComptePages } from '../compte-pages';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { SiteRoutes, SitePages } from 'src/app/site/site-pages';
import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Identifiant } from 'src/app/securite/identifiant';
import { VisiteurPages, VisiteurRoutes } from 'src/app/visiteur/visiteur-pages';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ConnectionComponent extends FormulaireComponent {

    pageDef: PageDef = ComptePages.connection;

    identifiant: Identifiant;

    créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe) => {
        return [Fabrique.bouton.boutonSoumettre(formulaire, 'Se connecter')];
    }

    apiDemande = (): Observable<ApiResult> => {
        this.identifiant = this.identification.litIdentifiant();
        return this.service.connecte(this.valeur);
    }

    actionSiOk = (): void => {
        const identifiant = this.identification.litIdentifiant();
        let nomSite: string;
        const urlPrécédente = this.navigation.urlPrécédente();
        if (urlPrécédente) {
            nomSite = SiteRoutes.nomSite(urlPrécédente);
        }
        // s'il n'y a pas de site en cours ou si l'identifiant est visiteur du site en cours
        if (nomSite === undefined || !identifiant.estUsagerDeNomSite(nomSite)) {
            nomSite = identifiant.nomSiteParDéfaut;
        }
        if (nomSite !== undefined) {
            this.routeur.naviguePageDef(SitePages.accueil, this.routeur.routesSite(nomSite, identifiant), nomSite);
        } else {
            this.routeur.navigate([urlPrécédente]);
        }
    }

    constructor(
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Connection impossible';
    }

    créeEdition = (): KfGroupe => {
        const identifiant = this.service.identification.litIdentifiant();
        const groupe = Fabrique.formulaire.groupeEdition('donnees');
        const nom = Fabrique.input.texte('userName', 'Nom');
        groupe.ajoute(nom);
        const password = Fabrique.input.texte('password', 'Mot de passe');
        password.typeDInput = KfTypeDInput.password;
        groupe.ajoute(password);
        const persistant = Fabrique.caseACocher('persistant', 'Rester connecté');
        persistant.valeur = false;
        groupe.ajoute(persistant);
        if (identifiant) {
            groupe.inactivité = true;
        } else {
            nom.ajouteValidateur(KfValidateurs.required);
            password.ajouteValidateur(KfValidateurs.required);
            const site = this.navigation.litSiteEnCours();
            let lienDef: ILienDef;
            if (site) {
                lienDef = {
                    urlDef: {
                        pageDef: VisiteurPages.devenirClient,
                        routes: VisiteurRoutes,
                        nomSite: site.nomSite
                    },
                    contenu: {
                        texte: 'Pas de compte ? Devenez client de ' + site.titre
                    }
                };
            } else {
                lienDef = {
                    urlDef: {
                        pageDef: AppSitePages.devenirFournisseur
                    },
                    contenu: {
                        texte: 'Pas de compte ? Devenez fournisseur.'
                    }
                };
            }
            this.aprèsBoutons = () => [Fabrique.lien.groupeDeLiens(lienDef)];
        }

        return groupe;
    }

}
