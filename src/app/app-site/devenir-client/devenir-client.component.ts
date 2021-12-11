import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Observable } from 'rxjs';
import { ApiResult } from '../../api/api-results/api-result';

import { PageDef } from 'src/app/commun/page-def';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CompteService } from 'src/app/compte/compte.service';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { ClientEditeur } from '../../modeles/client/client-editeur';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { ClientPages } from '../../client/client-pages';
import { AppSitePages } from '../app-site-pages';
import { InvitationClient } from './devenir-client-data';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { AppSite } from '../app-site';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class DevenirClientComponent extends FormulaireComponent implements OnInit, OnDestroy {

    pageDef: PageDef = AppSitePages.devenirClient;


    get titre(): string {
        return `${this.pageDef.titre} de: ${this.invitation.titre}`;
    }

    invitation: InvitationClient;

    texteBoutonSoumettre: () => string;

    créeBoutonsDeFormulaire: (formulaire: KfGroupe) => (KfBouton | KfLien)[];

    apiDemande: () => Observable<ApiResult>;

    actionSiOk: () => void;

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
        let étiquette: KfEtiquette;

        const éditeurClient = new ClientEditeur(this);

        étiquette = Fabrique.ajouteEtiquetteP();
        let texte = `Vous avez été invité par le fournisseur à `;
        if (this.invitation.nom) {
            texte += `prendre en charge un compte client qu'il a créé. `
                + `Si vous modifiez le nom qu'il avait choisi, pensez à l'en informer.`;
            éditeurClient.roleEditeur.fixeValeur(this.invitation);
            this.texteBoutonSoumettre = () => `Prendre en charge le compte client`;
        } else {
            texte = `créer votre compte client.`;
            this.texteBoutonSoumettre = () => `Créer votre compte client`;
        }
        étiquette.ajouteTextes(texte);
        groupe.ajoute(étiquette);
        éditeurClient.créeKfDeData();
        éditeurClient.kfDeData.forEach(c => groupe.ajoute(c));

        const code = Fabrique.input.texteInvisible('code', this.invitation.code);
        groupe.ajoute(code);

        étiquette = Fabrique.ajouteEtiquetteP();
        étiquette.ajouteTextes(
            `Entrez vos coordonnées de connection.`
        );
        groupe.ajoute(étiquette);

        const email = Fabrique.input.email();
        groupe.ajoute(email);
        const password = Fabrique.input.motDePasse(null);
        groupe.ajoute(password);

        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe((data: Data) => {
            this.invitation = data.invitation;
            this.niveauTitre = 0;
            this.créeTitrePage();
            if (!this.invitation.code) {
                this.créeAvantFormulaire = () => {
                    const groupe = Fabrique.alerte('exemple', 'info', undefined,
                        `Vous pouvez voir ci-dessous les informations à fournir pour devenir client d'un site sur ${AppSite.nom}`
                    )
                    return [groupe];
                }
                this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
                    return [
                        Fabrique.lien.bouton(
                            {
                                contenu: { texte: `Retour à l'accueil` },
                                urlDef: { routeur: Fabrique.url.appRouteur.appSite }
                            },
                            'dark'
                        ),
                    ];
                }
            } else {
                this.apiDemande = (): Observable<ApiResult> => {
                    return this.service.enregistreClient(this.valeur);
                }
            
                this.actionSiOk = (): void => {
                    Fabrique.url.appRouteur.site.fixeSite(this.invitation.url);
                    this.routeur.naviguePageDef(ClientPages.accueil, Fabrique.url.appRouteur.client);
                }
                            this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
                    this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, this.texteBoutonSoumettre());
                    return [this.boutonSoumettre];
                }
            }
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
        }));
    }

}
