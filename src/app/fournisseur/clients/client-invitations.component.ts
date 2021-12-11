import { Component, OnInit } from '@angular/core';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute, Data } from '@angular/router';
import { FournisseurClientPages } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { Invitation } from 'src/app/modeles/client/invitation';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { Compare } from 'src/app/commun/outils/tri';
import { ClientService } from 'src/app/modeles/client/client.service';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientInvitationsComponent extends PageTableComponent<Invitation> implements OnInit {

    pageDef = FournisseurClientPages.invitations;


    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService
    ) {
        super(route, service);
        this.fixeDefRéglagesVueTable('clients.invitations', (i: Invitation) => i.email);
    }

    /**
     * Charge les options des filtres par catégorie et par état de produit.
     * Charge le groupe d'affichage de l'état de la liste.
     * Charge la liste dans la vueTable.
     * Appelée aprés le chargement de la liste de la table et la création du superGroupe.
     */
     protected chargeGroupe() {
        // charge le groupe d'affichage de l'état de la liste
        this.groupeTable.etat.charge();
        // charge la liste dans la vueTable
        this._chargeVueTable(this.liste);
    }

    créeGroupeTableDef(): IGroupeTableDef<Invitation> {
        const outils = Fabrique.vueTable.outils<Invitation>();
        outils.ajoute(this.service.utile.lien.ajouteInvitation());
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n'y a pas d'invitation en attente de réponse.`);
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien,
                    this.service.utile.lien.ajouteInvitationDef());
                etat.grBtnsMsgs.alerte('warning');
            }).bind(this)
        });
        const rafraichitQuandSupprime = (invitation: Invitation) => {
            return (() => {
                const index = this.liste.findIndex(i => i.email === invitation.email);
                this.liste.splice(index, 1)
                this.vueTable.supprimeItem(index);
            }).bind(this);
        };
        const email = (invitation: Invitation) => invitation.email;
        const colonnesDef: IKfVueTableColonneDef<Invitation>[] = [
            {
                nom: 'email',
                enTeteDef: { titreDef: 'Email' },
                créeContenu: email,
                compare: Compare.texte(email)
            },
            {
                nom: 'date',
                enTeteDef: { titreDef: 'Date' },
                créeContenu: (invitation: Invitation) => () => TexteOutils.date.en_chiffres(invitation.date),
                compare: Compare.date((invitation: Invitation) => invitation.date),
                largeur: LargeurColonne.date,
            },
            {
                nom: 'client',
                enTeteDef: { titreDef: 'Compte existant' },
                créeContenu: (invitation: Invitation) => invitation.client ? invitation.client.nom : ''
            },
            {
                nom: 'réenvoie',
                créeContenu: (invitation: Invitation) => this.service.utile.lien.réenvoie(invitation),
                largeur: LargeurColonne.action,
            },
            {
                nom: 'supprime',
                créeContenu: (invitation: Invitation) => this.service.utile.bouton.supprimeInvitation(invitation, rafraichitQuandSupprime(invitation)),
                largeur: LargeurColonne.action,
            }
        ];
        return {
            vueTableDef: {
                colonnesDef,
                outils,
                id: (invitation: Invitation) => invitation.email
            },
            etatTable
        };
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => {
            this.niveauTitre = 1;
            this.site = this.service.litSiteEnCours();
        },
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }

}
