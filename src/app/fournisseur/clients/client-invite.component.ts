import { Component, OnInit } from '@angular/core';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Identifiant } from 'src/app/securite/identifiant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { AppSite } from 'src/app/app-site/app-site';
import { Client } from 'src/app/modeles/client/client';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { ActivatedRoute, Data } from '@angular/router';
import { FournisseurClientPages } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { ClientService } from 'src/app/modeles/client/client.service';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Invitation } from 'src/app/modeles/client/invitation';
import { InvitationUtileTexte } from 'src/app/modeles/client/invitation-utile-texte';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { PageDef } from 'src/app/commun/page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientInviteComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef;


    get titre(): string {
        if (this._client) {
            return this.pageDef.titre + ' ' + this._client.nom;
        }
        if (this._invitation) {
            return this.pageDef.titre + ' ' + this._invitation.email;
        }
        return this.pageDef.titre;
    }

    site: Site;
    identifiant: Identifiant;

    clients: Client[];
    invitations: Invitation[];

    _client: Client;
    _invitation: Invitation;
    email: KfInputTexte;
    remplace: KfCaseACocher;
    confirme: GroupeBoutonsMessages;

    get invitation(): Invitation {
        return this.valeur;
    }

    get client(): Client {
        if (this._client) {
            return this._client;
        }
        if (this._invitation) {
            return this._invitation.client;
        }
    }

    get urlRetour(): IUrlDef {
        if (this._client) {
            return this.service.utile.url.retourIndex(this._client);
        }
        if (this._invitation) {
            return this.service.utile.url.retourInvitations(this._invitation);
        }
        return this.service.utile.url.invitations();
    }

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        const annuler = Fabrique.lien.boutonAnnuler(this.urlRetour);
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, `Envoyer l'invitation`);
        return [annuler, this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.service.envoie(this.invitation);
    }

    actionSiOk = (créé: any): void => {
        Fabrique.formulaire.désactiveEtCacheBoutons(this);
        this.invitation.date = créé.date;
        this.service.quandEnvoi(this.invitation);
        this.confirme.groupe.nePasAfficher = true;
        this.afficheResultat.fixeDétails([
            `Un message a été envoyé à l'adresse ${this.email.valeur}`
            + ` contenant un lien sur lequel l'utilisateur devra cliquer pour `
            + InvitationUtileTexte.résultatEnregistrement(this.client),
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
            étiquette.ajouteTextes(
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
    ) {
        super(service);

        this.titreRésultatErreur = `Impossible d'envoyer le message d'invitation`;
        this.titreRésultatSucces = `Le message d'invitation a bien été envoyé`;
    }

    créeBarreTitre = (): IBarreTitre => {
        const lienIndex = this._client
            ? this.service.utile.lienKey.retourIndex(this._client)
            : this._invitation
                ? this.service.utile.lien.retourInvitation(this._invitation)
                : this.service.utile.lien.invitations();
        const groupe = Fabrique.titrePage.groupeRetour(lienIndex);
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            groupesDeBoutons: [groupe]
        });

        this.barre = barre;
        return barre;
    }

    créeAvantFormulaire = (): KfComposant[] => {
        const composants: KfComposant[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(composants);
        étiquette.ajouteTextes(
            `Pour qu'un de vos clients puisse accéder à ses données sur votre site, vous devez lui envoyer `
            + `une invitation, c'est à dire un message email envoyé par le serveur de ${AppSite.titre} contenant le texte: `,
            {
                texte: `Pour accéder à vos données de client sur le site ${this.site.titre} de ${AppSite.nom}, `
                    + `veuillez cliquer sur le lien ci-dessous.`,
                balise: KfTypeDeBaliseHTML.i
            }
        );
        étiquette = Fabrique.ajouteEtiquetteP(composants);
        étiquette.ajouteTextes(
            `En cliquant sur ce lien, votre client accèdera à une page de ${AppSite.nom} où il pourra `,
            InvitationUtileTexte.résultatEnregistrementAAjouter(this.client)
        );
        return composants;
    }

    créeConfirme() {
        const messages: KfEtiquette[] = [];
        let étiquette = Fabrique.ajouteEtiquetteP(messages);
        étiquette = Fabrique.ajouteEtiquetteP(messages);
        étiquette.ajouteTextes(
            `Etes- vous sûr de vouloir remplacer cette invitation et proposer à l'utilisateur invité de `,
            InvitationUtileTexte.résultatEnregistrementAAjouter(this.client)
        );
        this.confirme = new GroupeBoutonsMessages('confirme', { messages });
        this.confirme.alerte('warning');
        this.confirme.groupe.visible = false;
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        const id = Fabrique.input.nombreInvisible('id');
        id.valeur = this.site.id;
        groupe.ajoute(id);
        const emailTexte = 'Email du client';
        let client: Client;
        if (this._invitation) {
            client = this._invitation.client;
            this.email = Fabrique.input.texteLectureSeule('email', emailTexte);
            this.email.valeur = this._invitation.email;
            groupe.comportementFormulaire.neSoumetPasSiPristine = false;
        } else {
            client = this.client;
            this.email = Fabrique.input.email('email', );
            // l'utilisateur invité ne doit pas être déjà client
            this.email.ajouteValidateur(KfValidateurs.validateurDeFn('client_existe',
                (value: any) => {
                    const existe = value && this.clients.find(c => c.email === value);
                    return !!existe;
                },
                `Il y a déjà un client enregistré avec cette adresse email.`));
            // l'utilisateur ne doit pas être le fournisseur
            this.email.ajouteValidateur(KfValidateurs.validateurDeFn('est_fournisseur',
                (value: any) => value === this.identifiant.email,
                'Vous ne pouvez pas être client de votre site.'
            ))
            this.email.gereHtml.suitLaValeur();
            this.email.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, this.quandEmailChange.bind(this));
        }
        groupe.ajoute(this.email);
        const idClient = Fabrique.input.nombreInvisible('uidClient');
        groupe.ajoute(idClient);
        if (client) {
            idClient.valeur = client.id;
            if (client.invitation) {
                this.email.valeur = client.invitation.email;
                groupe.comportementFormulaire.neSoumetPasSiPristine = false;
            }
        }

        this.créeConfirme();
        groupe.ajoute(this.confirme.groupe);

        return groupe;
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe((data: Data) => {
            this._invitation = data.invitation;
            this._client = data.client;
            this.pageDef = this._client ? FournisseurClientPages.inviteClient : this._invitation ? FournisseurClientPages.réinvite : FournisseurClientPages.invite;
            this.clients = data.clients;
            this.invitations = data.liste;
            this.niveauTitre = 1;
            this.créeTitrePage();
            this.site = this.service.litSiteEnCours();
            this.identifiant = this.identification.litIdentifiant();
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
        }));
    }
}
