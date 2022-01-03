import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute, Data } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KeyIdIndexComponent } from 'src/app/commun/data-par-key/key-id/key-id-index.component';
import { IGroupeTableDef } from 'src/app/disposition/page-table/groupe-table';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { EtatRole } from 'src/app/modeles/role/etat-role';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { FournisseursPages } from './fournisseurs-pages';
import { KeyId } from 'src/app/commun/data-par-key/key-id/key-id';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { Fournisseur } from 'src/app/modeles/fournisseur/fournisseur';
import { FournisseurService } from 'src/app/modeles/fournisseur/fournisseur.service';
import { AdminPages } from '../admin-pages';
import { KfVueTableLigne } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FournisseursIndexComponent extends KeyIdIndexComponent<Fournisseur> implements OnInit {

    pageDef: PageDef = AdminPages.fournisseurs;

    get titre(): string {
        return this.pageDef.titre;
    }

    dataPages = FournisseursPages;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurService,
    ) {
        super(route, service);
        this.fixeDefRéglagesVueTable('fournisseurs.fournisseurs', (fournisseur: Fournisseur) => KeyId.texteDeKey(fournisseur));
    }

    créeGroupeTableDef(): IGroupeTableDef<Fournisseur> {
        const outils = Fabrique.vueTable.outils<Fournisseur>();
        outils.ajoute(this.service.utile.outils.chercheFournisseur());
        outils.ajoute(this.service.utile.outils.état());
        outils.texteRienPasseFiltres = `Il n'y a pas de fournisseur correspondant aux critères de recherche.`;
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: false,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n'y a pas de fournisseurs enregistrés.`);
                etat.grBtnsMsgs.alerte('warning');
            }).bind(this)
        });

        return {
            vueTableDef: {
                colonnesDef: this.service.utile.colonne.colonnes(),
                outils,
                id: (fournisseur: Fournisseur) => {
                    return this.service.fragment(fournisseur);
                },
                itemRéférenceLigne: (fournisseur: Fournisseur, ligne: KfVueTableLigne<Fournisseur>) => fournisseur.vueTableLigne = ligne,
                triInitial: { colonne: 'fournisseur', direction: 'asc' },
                gereCssLigne: (fournisseur: Fournisseur) => {
                    const gereCss = new KfGéreCss();
                    gereCss.ajouteClasse({
                        nom: KfBootstrap.classe('text', 'danger'),
                        active: () => fournisseur.etat === EtatRole.nouveau
                    });
                    return gereCss;
                },
                pagination: Fabrique.vueTable.pagination<Fournisseur>('fournisseur')
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

    chargeData(data: Data) {
        this.liste = data.liste;
    }

    créePageTableDef(): IPageTableDef {
        return {
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeGroupe('super'),
            chargeGroupe: () => this.chargeGroupe(),
        };
    }

}
