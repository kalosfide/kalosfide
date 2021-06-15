import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurClientPages, FournisseurClientRoutes } from './client-pages';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute, Data } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Client } from 'src/app/modeles/client/client';
import { KeyUidRnoIndexComponent } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-index.component';
import { ClientService } from 'src/app/modeles/client/client.service';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { EtatClient } from 'src/app/modeles/client/etat-client';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientIndexComponent extends KeyUidRnoIndexComponent<Client> implements OnInit {

    pageDef: PageDef = FournisseurClientPages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = FournisseurClientPages;
    dataRoutes = FournisseurClientRoutes;

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
        const outils = Fabrique.vueTable.outils<Client>();
        outils.ajoute(this.service.utile.outils.client());
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
                        nom: KfBootstrap.classe('text', 'danger'),
                        active: () => t.etat === EtatClient.nouveau
                    });
                    return gereCss;
                },
                pagination: Fabrique.vueTable.pagination<Client>('client')
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
