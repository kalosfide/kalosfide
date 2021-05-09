import { Component, OnInit } from '@angular/core';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Identifiant } from 'src/app/securite/identifiant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { AppSite } from 'src/app/app-site/app-site';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Client } from 'src/app/modeles/client/client';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { Observable, concat, of } from 'rxjs';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { ActivatedRoute, Data } from '@angular/router';
import { CompteService } from 'src/app/compte/compte.service';
import { FournisseurClientPages } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { ClientService } from 'src/app/modeles/client/client.service';
import { concatMap, take, map, switchMap } from 'rxjs/operators';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { BootstrapNom } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Invitation } from 'src/app/modeles/invitation/invitation';
import { InvitationData } from 'src/app/modeles/invitation/invitation-data';
import { InvitationService } from 'src/app/modeles/invitation/invitation.service';
import { InvitationUtileTexte } from 'src/app/modeles/invitation/invitation-utile-texte';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientInviteComponent extends FormulaireComponent implements OnInit {

    pageDef = FournisseurClientPages.invite;


    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;
    identifiant: Identifiant;

    invitations: Invitation[];
    urlSegmentParent: string;

    client: Client;
    email: KfInputTexte;
    remplace: KfCaseACocher;
    confirme: GroupeBoutonsMessages;

    get invitation(): Invitation {
        return this.valeur;
    }

    get urlDefParent(): IUrlDef {
        switch (this.urlSegmentParent) {
            case FournisseurClientPages.accueil.urlSegment:
                return this.service.utile.url.accueil();
            case FournisseurClientPages.invitations.urlSegment:
                return this.service.utile.url.invitations();
            case FournisseurClientPages.index.urlSegment:
                return this.service.utile.url.retourIndex(this.client);
            default:
                break;
        }
    }

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        const annuler = Fabrique.lien.boutonAnnuler(this.urlDefParent);
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, `Envoyer l'invitation`);
        return [annuler, this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.invitationService.envoie(this.invitation);
    }

    actionSiOk = (créé: any): void => {
        Fabrique.formulaire.désactiveEtCacheBoutons(this);
        this.invitation.date = créé.date;
        this.invitationService.quandEnvoi(this.invitation);
        this.afficheResultat.fixeDétails([
            `Un message a été envoyé à l'adresse ${this.email.valeur}`
            + ` contenant un lien sur lequel l'utilisateur devra cliquer pour `
            + InvitationUtileTexte.résultatEnregistrement(this.client)
        ]);
    }

    quandEmailChange() {
        if (this.email.abstractControl.invalid) {
            return;
        }
        const existante = this.invitations.find(i => i.email === this.email.valeur);
        if (!existante || Invitation.mêmeClient(this.invitation, existante)) {
            this.confirme.groupe.visible = false;
        } else {
            const étiquette: KfEtiquette = this.confirme.messages[0] as KfEtiquette;
            étiquette.contenuPhrase.contenus = [];
            Fabrique.ajouteTexte(étiquette,
                `Un message avait déjà été envoyé à l'utilisateur ${this.email.valeur} pour l'inviter à `,
                InvitationUtileTexte.résultatEnregistrementAAjouter(existante.client),
                `le ${TexteOutils.date.en_chiffres(existante.date)} à ${TexteOutils.date.h_Min(existante.date)}.`
            );
            this.confirme.groupe.visible = true;
        }
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
        private invitationService: InvitationService,
    ) {
        super(service);

        this.titreRésultatErreur = `Impossible d'envoyer le message d'invitation`;
        this.titreRésultatSucces = `Le message d'invitation a bien été envoyé`;
    }

    créeBarreTitre = (): BarreTitre => {
        const lienIndex = this.client
            ? this.service.utile.lienKey.retourIndex(this.client)
            : this.service.utile.lienKey.index();
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            boutonsPourBtnGroup: [[lienIndex]]
        });

        this.barre = barre;
        return barre;
    }

    créeAvantFormulaire = (): KfComposant[] => {
        const composants: KfComposant[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(composants);
        Fabrique.ajouteTexte(étiquette,
            `Pour qu'un de vos clients puisse accéder à ses données sur votre site, vous devez lui envoyer `
            + `une invitation, c'est à dire un message email envoyé par le serveur de ${AppSite.titre} contenant le texte: `,
            {
                texte: `Pour accéder à vos données de client sur le site ${this.site.titre} de ${AppSite.nom}, `
                    + `veuillez cliquer sur le lien ci-dessous.`,
                balise: KfTypeDeBaliseHTML.i
            }
        );
        étiquette = Fabrique.ajouteEtiquetteP(composants);
        Fabrique.ajouteTexte(étiquette,
            `En cliquant sur ce lien, votre client accèdera à une page de ${AppSite.nom} où il pourra `,
            InvitationUtileTexte.résultatEnregistrementAAjouter(this.client)
        );
        return composants;
    }

    créeConfirme() {
        const messages: KfEtiquette[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(messages);
        étiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(étiquette,
            `Etes- vous sûr de vouloir remplacer cette invitation et proposer à l'utilisateur invité de `,
            InvitationUtileTexte.résultatEnregistrementAAjouter(this.client)
        );
        this.confirme = new GroupeBoutonsMessages('confirme', { messages });
        this.confirme.alerte(BootstrapNom.warning);
        this.confirme.groupe.visible = false;
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        const uid = Fabrique.input.texteInvisible('uid');
        uid.valeur = this.site.uid;
        groupe.ajoute(uid);
        const rno = Fabrique.input.nombreInvisible('rno');
        rno.valeur = this.site.rno;
        groupe.ajoute(rno);
        this.email = Fabrique.input.email('email', 'Email du client');
        this.email.gereHtml.suitLaValeur();
        this.email.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, this.quandEmailChange.bind(this));
        groupe.ajoute(this.email);
        const uidClient = Fabrique.input.texteInvisible('uidClient');
        groupe.ajoute(uidClient);
        const rnoClient = Fabrique.input.nombreInvisible('rnoClient');
        groupe.ajoute(rnoClient);
        if (this.client) {
            uidClient.valeur = this.client.uid;
            rnoClient.valeur = this.client.rno;
        }

        this.créeConfirme();
        groupe.ajoute(this.confirme.groupe);

        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe((data: Data) => {
            this.niveauTitre = 1;
            this.créeTitrePage();
            this.client = data.valeur;
            this.invitations = data.liste;
            this.urlSegmentParent = data.retour;
            this.site = this.navigation.litSiteEnCours();
            this.identifiant = this.identification.litIdentifiant();
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
        }));
    }
}
