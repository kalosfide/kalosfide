import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CompteService } from '../compte.service';

import { ApiResult } from '../../api/api-results/api-result';
import { ComptePages } from '../compte-pages';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { SitePages } from 'src/app/site/site-pages';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Identifiant } from 'src/app/securite/identifiant';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/modeles/role/role';
import { Routeur } from 'src/app/commun/routeur';
import { AdminPages } from 'src/app/admin/admin-pages';


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
        const appRouteur = Fabrique.url.appRouteur;
        if (identifiant.estAdministrateur) {
            this.routeur.naviguePageDef(AdminPages.accueil, appRouteur.admin);
            return;
        }
        let role: Role;
        if (identifiant.noDernierRole !== undefined) {
            role = identifiant.rolesAccessibles.find(r => r.rno === identifiant.noDernierRole);
        }
        if (role) {
            appRouteur.site.fixeSite(role.site.url);
            const routeur: Routeur = role.estFournisseur
                ? appRouteur.fournisseur
                : appRouteur.client;
            this.routeur.naviguePageDef(SitePages.accueil, routeur);
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
                    pageDef: ComptePages.oubliMotDePasse,
                    routeur: Fabrique.url.appRouteur.compte,
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
