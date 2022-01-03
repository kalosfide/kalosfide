import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurClientPages } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { ActivatedRoute, Data } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Client } from 'src/app/modeles/client/client';
import { KeyIdIndexComponent } from 'src/app/commun/data-par-key/key-id/key-id-index.component';
import { ClientService } from 'src/app/modeles/client/client.service';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { EtatRole } from 'src/app/modeles/role/etat-role';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { Invitation } from 'src/app/modeles/client/invitation';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientIndexComponent extends KeyIdIndexComponent<Client> implements OnInit {

    pageDef: PageDef = FournisseurClientPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = FournisseurClientPages;

    site: Site;

    invitations: Invitation[];

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);
        this.fixeDefRéglagesVueTable('clients.clients', (c: Client) => c.id);
    }

    créeGroupeTableDef(): IGroupeTableDef<Client> {
        const outils = Fabrique.vueTable.outils<Client>();
        outils.ajoute(this.service.utile.outils.client());
        outils.ajoute(this.service.utile.outils.état());
        outils.texteRienPasseFiltres = `Il n'y a pas de client correspondant aux critères de recherche.`;
        outils.ajoute(this.service.utile.outils.ajoute());
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n'y a pas de clients enregistrés.`);
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.lienDefAjoute());
                etat.grBtnsMsgs.alerte('warning');
            }).bind(this)
        });

        return {
            vueTableDef: {
                colonnesDef: this.service.utile.colonne.colonnes(),
                outils,
                id: (client: Client) => {
                    return this.service.fragment(client);
                },
                triInitial: { colonne: 'nom', direction: 'asc' },
                gereCssLigne: (t: Client) => {
                    const gereCss = new KfGéreCss();
                    gereCss.ajouteClasse({
                        nom: this.service.utile.classeNouveau,
                        active: () => t.etat === EtatRole.nouveau
                    });
                    return gereCss;
                },
                pagination: Fabrique.vueTable.pagination<Client>('client')
            },
            etatTable
        };
    }

    /**
     * Charge les options des filtres.
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

    calculeModeTable(): ModeTable {
        return ModeTable.edite;
    }

    avantChargeData() {
        this.site = this.service.litSiteEnCours();
    }

    chargeData(data: Data) {
        this.liste = data.liste;
        const invitations: Invitation[] = data.invitations;
        invitations.forEach(i => {
            
        })
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            initialiseUtile: () => this.service.initialiseModeTable(this.calculeModeTable()),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }

}
