import { Component, OnInit } from '@angular/core';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute, Data } from '@angular/router';
import { FournisseurClientPages } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { Invitation } from 'src/app/modeles/invitation/invitation';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { InvitationService } from 'src/app/modeles/invitation/invitation.service';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { Compare } from 'src/app/commun/outils/tri';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientInvitationsComponent extends PageTableComponent<Invitation> implements OnInit {

    pageDef = FournisseurClientPages.invitations;


    get titre(): string {
        return this.pageDef.titre;
    }

    identifiant: Identifiant;
    site: Site;

    constructor(
        protected route: ActivatedRoute,
        protected service: InvitationService
    ) {
        super(route, service);
    }

    protected chargeGroupe() {
        this.groupeTable.etat.charge();
        this._chargeVueTable(this.liste);
    }

    créeGroupeTableDef(): IGroupeTableDef<Invitation> {
        const outils = Fabrique.vueTable.outils<Invitation>();
        outils.ajoute(this.service.utile.outils.ajoute());
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n'y a pas d'invitation en attente de réponse.`);
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien,
                    this.service.utile.lien.ajouteDef(this.pageDef.urlSegment));
                etat.grBtnsMsgs.alerte('warning');
            }).bind(this)
        });
        const rafraichitQuandSupprime = () => {
            this.liste = this.service.litInvitations();
            this.chargeGroupe();
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
                classeDefs: ['date'],
                compare: Compare.date((invitation: Invitation) => invitation.date)
            },
            {
                nom: 'client',
                enTeteDef: { titreDef: 'Client éventuel' },
                créeContenu: (invitation: Invitation) => invitation.client ? invitation.client.nom : ''
            },
            {
                nom: 'réenvoie',
                créeContenu: (invitation: Invitation) => this.service.utile.lien.réenvoie(invitation)
            },
            {
                nom: 'supprime',
                créeContenu: (invitation: Invitation) => this.service.utile.bouton.supprime(invitation, rafraichitQuandSupprime.bind(this))
            }
        ];
        return {
            vueTableDef: {
                colonnesDef,
                outils,
            },
            etatTable
        };
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => {
            this.niveauTitre = 1;
            this.site = this.service.navigation.litSiteEnCours();
            this.identifiant = this.service.identification.litIdentifiant();
        },
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }

}
