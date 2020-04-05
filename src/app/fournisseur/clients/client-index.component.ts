import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { ClientPages, ClientRoutes } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Client } from 'src/app/modeles/client/client';
import { KeyUidRnoIndexComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-index.component';
import { ClientService } from 'src/app/modeles/client/client.service';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ClientIndexComponent extends KeyUidRnoIndexComponent<Client> implements OnInit {

    pageDef: PageDef = ClientPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = ClientPages;
    dataRoutes = ClientRoutes;

    site: Site;
    identifiant: Identifiant;
    clients: Client[];

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);
    }

    créeGroupeTableDef(): IGroupeTableDef<Client> {
        const outils = Fabrique.vueTable.outils<Client>(this.nom);
        outils.ajoute(this.service.utile.outils.client());
        outils.texteRienPasseFiltres = `Il n\'a pas de client correspondant aux critères de recherche.`;
        outils.ajoute(this.service.utile.outils.ajoute());
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte('Il n\'a pas de clients.');
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.lienDefAjoute());
                etat.grBtnsMsgs.alerte('warning');
            }).bind(this)
        });

        return {
            vueTableDef: {
                colonnesDef: this.service.utile.colonne.colonnes(),
                outils,
                id: (t: Client) => {
                    return this.service.utile.url.id(KeyUidRno.texteDeKey(t));
                },
                optionsDeTrieur: Fabrique.vueTable.optionsDeTrieur()
            },
            etatTable
        };
    }

    protected chargeGroupe() {
        this.groupeTable.etat.charge();
        this._chargeVueTable(this.liste);
    }

    calculeModeTable(): ModeTable {
        return ModeTable.edite;
    }

    avantChargeData() {
        this.site = this.service.navigation.litSiteEnCours();
        this.identifiant = this.service.identification.litIdentifiant();
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.chargeGroupe = () => this.chargeGroupe();
        this.pageTableDef.initialiseUtile = () => this.service.initialiseModeTable(this.calculeModeTable());
    }

}
