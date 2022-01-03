import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Site } from 'src/app/modeles/site/site';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { CLFService } from './c-l-f.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { CLFUtile } from './c-l-f-utile';
import { CLFDocs } from './c-l-f-docs';
import { ModeAction } from './condition-action';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { TypeCLF } from './c-l-f-type';

@Component({ template: '' })
export abstract class CLFClientsComponent extends PageTableComponent<CLFDocs> implements OnInit, OnDestroy {

    site: Site;

    date: Date;

    clfDocs: CLFDocs;

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,

    ) {
        super(route, service);
        this.niveauTitre = 1;
    }

    protected fixeTypeDefRéglagesVueTable(type: TypeCLF) {
        this.fixeDefRéglagesVueTable(`${type}.clients`, (c: CLFDocs) => c.client.id);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    get texteUtile() {
        return this.utile.texte.textes(this.clfDocs.type);
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        this.barre = barre;

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFDocs> {
        const outils = Fabrique.vueTable.outils<CLFDocs>();
        outils.ajoute(this.utile.outils.clientDeDocsClient());

        const vueTableDef: IKfVueTableDef<CLFDocs> = {
            colonnesDef: this.utile.colonne.client.colonnesDocumentsClient(this.clfDocs),
            outils,
            id: (t: CLFDocs) => {
                return this.utile.url.id(KeyId.texteDeKey(t.client));
            },
            quandClic: (clfDocs: CLFDocs) => (() => this.service.routeur.navigueUrlDef(this.utile.url.client(clfDocs.client))).bind(this),
            triInitial: { colonne: 'nbDocuments', direction: 'desc' },
            pagination: Fabrique.vueTable.pagination<CLFDocs>('client'),
            navigationAuClavier: { type: 'lignes', controlePagination: true }
        };
        return {
            vueTableDef,
        };
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('documents');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<CLFDocs>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    rafraichit() {
        this.barre.site = this.service.litSiteEnCours();
        this.barre.rafraichit();
    }

    avantChargeData() {
        this.site = this.service.litSiteEnCours();
    }

    chargeData(data: Data) {
        this.clfDocs = data.clfDocs;
        this.liste = this.clfDocs.créeDocumentsClients();
        this.date = new Date(Date.now());
    }

    initialiseUtile() {
        this.service.changeMode(ModeAction.edite);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.comportementFormulaire = { sauveQuandChange: true };

        if (this.clfDocs.clients.length === 0) {
            const message = `Il n'y a pas de client enregistré.`;
            const lienDef: ILienDef = {
                urlDef: {
                    routeur: Fabrique.url.appRouteur.clients
                }
            };
            this.superGroupe.ajoute(this.utile.groupeCréationImpossible(this.clfDocs.type, message, lienDef));
        } else {
            const etiquette = Fabrique.ajouteEtiquetteP();
            etiquette.fixeTexte(`Choisissez le client pour lequel vous voulez créer ${this.utile.texte.textes(this.clfDocs.type).un_doc}.`);
            this.superGroupe.ajoute(etiquette);
            this.ajouteGroupeDétails();
        }

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        this._chargeVueTable(this.liste);
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.service.utile.url.fixeRouteBase(this.clfDocs.type),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
