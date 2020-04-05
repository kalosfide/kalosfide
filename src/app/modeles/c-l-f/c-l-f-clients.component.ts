import { OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { CLFService } from './c-l-f.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { SiteService } from 'src/app/modeles/site/site.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { CLFUtile } from './c-l-f-utile';
import { CLFDocs } from './c-l-f-docs';
import { ModeAction } from './condition-action';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';

export abstract class CLFClientsComponent extends PageTableComponent<CLFDocs> implements OnInit, OnDestroy {

    site: Site;
    identifiant: Identifiant;
    barre: BarreTitre;
    niveauTitre = 1;

    date: Date;

    clfDocs: CLFDocs;
    documentsClients: CLFDocs[];

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
        protected siteService: SiteService,
    ) {
        super(route, service);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    get texteUtile() {
        return this.utile.texte.textes(this.clfDocs.type);
    }

    créeBarreTitre = (): BarreTitre => {
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
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFDocs> {
        const outils = Fabrique.vueTable.outils<CLFDocs>(this.nom);
        outils.ajoute(this.utile.outils.clientDeDocsClient());

        const vueTableDef: IKfVueTableDef<CLFDocs> = {
            colonnesDef: this.utile.colonne.client.colonnesDocumentsClient(this.clfDocs),
            outils,
            id: (t: CLFDocs) => {
                return this.utile.url.id(KeyUidRno.texteDeKey(t.client));
            },
            quandClic: (docsClient: CLFDocs) => (() => this.routeur.navigueUrlDef(this.utile.url.client(docsClient))).bind(this),
            optionsDeTrieur: Fabrique.vueTable.optionsDeTrieur([
                { nomTri: 'client' },
                { nomTri: 'nbDocuments', desc: true },
                { nomTri: 'nbPrêts', desc: true }
            ])
        };
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n\'a pas de ${this.texteUtile.def.bon} envoyé par ${this.clfDocs.client.nom}.`);
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.utile.lien.bonVirtuelDef(this.clfDocs));
                etat.grBtnsMsgs.alerte('info');
            }).bind(this)
        });
        return {
            vueTableDef,
            etatTable
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
        this.barre.site = this.service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    avantChargeData() {
        this.site = this.service.navigation.litSiteEnCours();
        this.identifiant = this.service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        this.clfDocs = data.clfDocs;
        this.documentsClients = this.clfDocs.créeDocumentsClients();
        this.date = new Date(Date.now());
    }

    initialiseUtile() {
        this.service.changeMode(ModeAction.edite);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        if (this.clfDocs.clients.length === 0) {
            const message = `Il n'y a pas de client enregistré.`;
            const lienDef: ILienDef = {
                urlDef: {
                    routes: FournisseurRoutes,
                    pageDef: FournisseurPages.clients,
                    nomSite: this.site.nomSite
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
        this._chargeVueTable(this.documentsClients);
        this.rafraichit();
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.service.utile.url.fixeRouteBase(this.clfDocs.type),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }
}
