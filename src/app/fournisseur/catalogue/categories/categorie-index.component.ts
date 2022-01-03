import { Component, OnInit } from '@angular/core';
import { KeyUidRnoNoIndexComponent } from 'src/app/commun/data-par-key/key-id-no/key-id-no-index.component';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { PageDef } from 'src/app/commun/page-def';
import { CategoriePages } from './categorie-pages';
import { Site } from 'src/app/modeles/site/site';
import { ActivatedRoute, Data } from '@angular/router';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';
import { ProduitPages } from '../produits/produit-pages';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
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
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { KeyIdIndexComponent } from 'src/app/commun/data-par-key/key-id/key-id-index.component';

@Component({
    templateUrl: '../../../disposition/page-base/page-base.html',
})
export class CategorieIndexComponent extends KeyIdIndexComponent<Categorie> implements OnInit {
    pageDef: PageDef = CategoriePages.index;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = CategoriePages;

    site: Site;

    catalogue: Catalogue;

    constructor(
        protected route: ActivatedRoute,
        protected service: CategorieService,
    ) {
        super(route, service);
        this.fixeDefRéglagesVueTable('catalogue.categorie', (c: Categorie) => c.id);
    }

    protected get barreTitreDef(): IBarreDef {
        const urlDef: IUrlDef = {
            pageDef: ProduitPages.index,
            routeur: Fabrique.url.appRouteur.produit
        };
        const lien = Fabrique.lien.retour(urlDef);
        const def = this._barreTitreDef;
        const groupe = Fabrique.titrePage.groupeRetour(lien);
        def.groupesDeBoutons = [groupe];
    return def;
    }

    protected contenuAidePage = (): KfComposant[] => {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }

    créeGroupeTableDef(): IGroupeTableDef<Categorie> {
        const outils = Fabrique.vueTable.outils<Categorie>();
        outils.ajoute(this.service.utile.outils.catégorie());
        const outilAjoute = this.service.utile.outils.ajoute();
        outilAjoute.bbtnGroup.afficherSi(this.service.utile.conditionTable.edition);
        outils.ajoute(outilAjoute);

        const vueTableDef: IKfVueTableDef<Categorie> = {
            outils,
            colonnesDef: this.service.utile.colonne.colonnes((this.quandLigneSupprimée).bind(this)),
            id: (catégorie: Categorie) =>  {
                return this.service.fragment(catégorie);
            },
    };
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n'y a pas de categories de produits.`);
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
        return !this.site.ouvert ? ModeTable.edite : ModeTable.aperçu;
    }

    rafraichit(site: Site) {
        this.site = site;
        this.service.changeModeTable(this.calculeModeTable());
    }

    aprèsChargeData() {
        this.subscriptions.push(this.service.identification.souscritASiteChange(this.rafraichit.bind(this)));
    }

    protected chargeGroupe() {
        // charge le groupe d'affichage de l'état de la liste
        this.groupeTable.etat.charge();
        // charge la liste dans la vueTable
        this._chargeVueTable(this.liste);
    }

    avantChargeData() {
        this.site = this.service.litSiteEnCours();
    }

    /**
     * fixe la liste de la vueTable: surcharge du  cas par défaut où il y a un champ 'liste'
     * @param data Data résolu avec un champ 'catalogue'
     */
    protected chargeData(data: Data) {
        const catalogue: Catalogue = Catalogue.nouveau(data.catalogue);
        this.liste = catalogue.catégories;
        this.liste.forEach(c => c.compteProduits(catalogue.produits));
    }

    quandLigneSupprimée(index: number, aprésSuppression: Catalogue) {
        this.liste = aprésSuppression.catégories;
        this.vueTable.supprimeItem(index);
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            initialiseUtile: () => this.service.initialiseModeTable(this.calculeModeTable()),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData(),
        };
    }
}
