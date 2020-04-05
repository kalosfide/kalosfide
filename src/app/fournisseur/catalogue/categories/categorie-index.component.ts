import { Component, OnInit } from '@angular/core';
import { KeyUidRnoNoIndexComponent } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-index.component';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { PageDef } from 'src/app/commun/page-def';
import { CategoriePages, CategorieRoutes } from './categorie-pages';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute, Data } from '@angular/router';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';
import { ProduitRoutes, ProduitPages } from '../produits/produit-pages';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { IBarreDef } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
    styleUrls: ['../../../commun/commun.scss']
})
export class CategorieIndexComponent extends KeyUidRnoNoIndexComponent<Categorie> implements OnInit {

    static sPageDef: PageDef = CategoriePages.index;
    pageDef: PageDef = CategoriePages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = CategoriePages;
    dataRoutes = CategorieRoutes;

    site: Site;
    identifiant: Identifiant;

    catalogue: Catalogue;

    constructor(
        protected route: ActivatedRoute,
        protected service: CategorieService,
    ) {
        super(route, service);
    }

    protected get barreTitreDef(): IBarreDef {
        const urlDef: IUrlDef = {
            pageDef: ProduitPages.index,
            routes: ProduitRoutes,
            nomSite: this.site.nomSite
        };
        const lien = Fabrique.lien.retour(urlDef);
        const def = this._barreTitreDef;
        def.boutonsPourBtnGroup = [[lien]];
        return def;
    }

    protected contenuAidePage = (): KfComposant[] => {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }

    créeGroupeTableDef(): IGroupeTableDef<Categorie> {
        const outils = Fabrique.vueTable.outils<Categorie>(this.nom);
        outils.ajoute(this.service.utile.outils.catégorie());
        const outilAjoute = this.service.utile.outils.ajoute();
        outilAjoute.bbtnGroup.afficherSi(this.service.utile.conditionTable.edition);
        outils.ajoute(outilAjoute);

        const vueTableDef: IKfVueTableDef<Categorie> = {
            outils,
            colonnesDef: this.service.utile.colonne.colonnes((this.quandLigneSupprimée).bind(this)),
            id: (catégorie: Categorie) => '' + catégorie.no,
        };
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte('Il n\'a pas de categories de produits.');
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.lienDefAjoute());
                etat.grBtnsMsgs.alerte('danger');
            }).bind(this)
        });
        return {
            vueTableDef,
            etatTable
        };
    }

    calculeModeTable(): ModeTable {
        return this.site.etat === IdEtatSite.catalogue ? ModeTable.edite : ModeTable.aperçu;
    }

    rafraichit() {
        this.service.changeModeTable(this.calculeModeTable());
    }

    aprèsChargeData() {
        this.subscriptions.push(
            this.service.navigation.siteObs().subscribe(() => this.rafraichit())
        );
    }

    protected chargeGroupe() {
        this.groupeTable.etat.charge();
        this._chargeVueTable(this.liste);
    }

    avantChargeData() {
        this.site = this.service.navigation.litSiteEnCours();
        this.identifiant = this.service.identification.litIdentifiant();
    }

    /**
     * fixe la liste de la vueTable: surcharge du  cas par défaut où il y a un champ 'liste'
     * @param data Data résolu avec un champ 'catalogue'
     */
    protected chargeData(data: Data) {
        const catalogue: Catalogue = Catalogue.nouveau(data.catalogue);
        this.liste = catalogue.catégories;
        this.liste.forEach(c => c.créeBilans(catalogue.produits));
    }

    quandLigneSupprimée() {
        this.liste = this.service.litCatégories();
        this.chargeGroupe();
    }

    créePageTableDef() {
        this.pageTableDef = this.créePageTableDefBase();
        this.pageTableDef.avantChargeData = () => this.avantChargeData();
        this.pageTableDef.initialiseUtile = () => this.service.initialiseModeTable(this.calculeModeTable());
        this.pageTableDef.chargeGroupe = () => this.chargeGroupe();
        this.pageTableDef.aprèsChargeData = () => this.aprèsChargeData();
    }

}
