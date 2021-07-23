import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CompteService } from '../compte.service';

import { ApiResult } from '../../api/api-results/api-result';
import { ComptePages, CompteRoutes } from '../compte-pages';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { IKfComportementFormulaire, KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { SitePages, ISiteRoutes } from 'src/app/site/site-pages';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Identifiant } from 'src/app/securite/identifiant';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { ActivatedRoute } from '@angular/router';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { FournisseurRoutes } from 'src/app/fournisseur/fournisseur-pages';
import { ClientRoutes } from 'src/app/client/client-pages';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfRadios } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { KfRadio } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radio';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ConnectionComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = ComptePages.connection;


    identifiant: Identifiant;

    confirmeEmail: string;

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        if (this.identifiant) {
            return [];
        }
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Se connecter');
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        this.identifiant = this.identification.litIdentifiant();
        return this.service.connecte(this.valeur);
    }

    actionSiOk = (): void => {
        const identifiant = this.identification.litIdentifiant();
        const urlSite = identifiant.urlSiteParDéfaut;
        if (urlSite) {
            const routes: ISiteRoutes = identifiant.estFournisseurDeSiteParUrl(urlSite) ? FournisseurRoutes : ClientRoutes;
            this.routeur.naviguePageDef(SitePages.accueil, routes, urlSite);
        } else {
            this.routeur.naviguePageDef(AppSitePages.accueil);
        }
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Connection impossible';
    }

    créeAvantFormulaire = (): KfComposant[] => {
        const groupe = Fabrique.formulaire.formulaire('test');
        const radios = new KfRadios('radios');
        groupe.ajoute(radios);
        for (let i = 1; i <= 4; i++) {
            const radio = new KfRadio('radio' + i, '' + i, 'Radion ' + i);
            KfBootstrap.prépareRadio(radio, { label: {}, interrupteur: true })
            radios.ajoute(radio);
        }
        const caseACocher = new KfCaseACocher('case', 'Case à cocher');
        KfBootstrap.prépareCaseACocher(caseACocher, { label: {}, interrupteur: true });
        groupe.ajoute(caseACocher);
        caseACocher.gereHtml.suitLaValeur();
        const boutonSoumettre = Fabrique.bouton.soumettre(groupe, 'Test');
        const grpBtn = new GroupeBoutonsMessages(groupe.nom, { boutons: [boutonSoumettre] })
        groupe.ajoute(grpBtn.groupe);
        const comportementFormulaire: IKfComportementFormulaire = {
            sauveQuandChange: true,
            neSoumetPasSiPristine: true,
            traiteSubmit: { traitement: () => {
                console.log(`Submit test: `, groupe.valeur);
            }}
        };
        groupe.comportementFormulaire = comportementFormulaire;
        return [groupe];
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        const email = Fabrique.input.email();
        email.valeur = this.confirmeEmail;
        groupe.ajoute(email);
        const password = Fabrique.input.motDePasse(null);
        groupe.ajoute(password);
        if (this.identifiant) {
            // l'utilisateur est déjà connecté
            groupe.inactivité = true;
        } else {
            email.ajouteValidateur(KfValidateurs.required);
            password.ajouteValidateur(KfValidateurs.required);
            const def: ILienDef = {
                nom: 'oubliMotDePasse',
                urlDef: {
                    keys: CompteRoutes.route([ComptePages.oubliMotDePasse.urlSegment]),
                },
                contenu: { texte: ComptePages.oubliMotDePasse.lien },
            };
            this.aprèsBoutons = () => [Fabrique.lien.groupeDeLiens(def)];
        }

        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this.confirmeEmail = data.email;
                this.identifiant = this.service.identification.litIdentifiant();
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.superGroupe = Fabrique.formulaire.superGroupe(this);
            }
        ));
    }

}
