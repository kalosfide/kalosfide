import { KfVueTable } from '../../commun/kf-composants/kf-vue-table/kf-vue-table';

import { PageBaseComponent } from '../page-base/page-base.component';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Data, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { OnInit, OnDestroy, AfterViewInit, Component } from '@angular/core';
import { GroupeTable, IGroupeTableDef } from './groupe-table';
import { IPageTableDef } from './i-page-table-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { KfVueTableRéglages } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-reglages';

@Component({ template: '' })
export abstract class PageTableComponent<T> extends PageBaseComponent implements OnInit, OnDestroy, AfterViewInit {

    liste: T[] = [];

    groupeTable: GroupeTable<T>;

    get vueTable(): KfVueTable<T> {
        return this.groupeTable.vueTable;
    }

    /**
     * Si défini, les réglages (valeurs des filtres, du tri, de la pagination et de la navigation) de la vueTable
     * seront sauvegardés dans le ngOnDestroy et rétablis au chargement de la liste dans le ngOnInit.
     */
    private defRéglagesVueTable: {
        nom: string,
        /**
     * @param id fonction qui retourne le même identifiant pour des items qui représentent le même objet
     * (doit être défini si les réglages contiennent la ligne active)
         */
        id?: (t: T) => string | number
    };

    fragment: string;

    constructor(
        protected route: ActivatedRoute,
        protected service: DataService
    ) {
        super();
    }

    get iservice(): DataService {
        return this.service;
    }

    /**
     * doit initialiser la liste
     * par défaut: data a un champ 'liste', fixe la liste de la vueTable
     * @param data Data à fournir par le resolver
     */
    protected chargeData(data: Data) {
        this.liste = data.liste;
    }

    protected abstract créePageTableDef(): IPageTableDef;

    abstract créeGroupeTableDef(): IGroupeTableDef<T>;

    protected créeGroupe(superGroupe?: 'super'): KfGroupe {
        const groupeTableDef = this.créeGroupeTableDef();
        const groupe: KfGroupe | KfSuperGroupe = superGroupe ? new KfSuperGroupe(this.nom) : new KfGroupe(this.nom);
        if (groupeTableDef.vueTableDef.superGroupe) {
            groupe.créeGereValeur();
        }
        this.groupeTable = new GroupeTable<T>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        if (superGroupe) {
            const sg = groupe as KfSuperGroupe;
            sg.quandTousAjoutés();
            this.superGroupe = sg;
        }
        return groupe;
    }

    /**
     * Fixe les paramétres permettant la sauvegarde et le chargement des réglages de la vueTable
     * (valeurs des filtres, du tri, de la pagination et de la navigation).
     * @param nom nom dans le stockage (doit être unique dans l'application)
     * @param id fonction qui retourne le même identifiant pour des items qui représentent le même objet
     * (doit être défini si les réglages contiennent la ligne active)
     */
    protected fixeDefRéglagesVueTable(nom: string, id?: (t: T) => string | number) {
        this.defRéglagesVueTable = { nom, id };
    }

    /**
     * Appelée aprés le chargement de la liste de la table et la création du superGroupe.
     * Charge la liste dans la vueTable.
     */
    protected chargeGroupe() {
        this._chargeVueTable(this.liste);
    }

    /**
     * Remplit la table en créant les lignes et initialise éventuellement la valeur, le tri, les outils, la pagination
     * et la référence de l'item à la ligne
     * @param items items à afficher
     * @param réglages objet contenant les valeurs des filtres, du tri, de la pagination et de la navigation
     * sauvegardés lors d'une utilisation antérieure de la vueTable
     * @param sontSemblables fonction qui retourne vrai si les items comparés représentent le même objet
     */
    protected _chargeVueTable(liste: T[]) {
        let réglages: KfVueTableRéglages;
        let id: (t: T) => string | number;
        if (this.defRéglagesVueTable) {
            // lit les paramétres d'affichage sauvegardés dans un ngOnDestroy précédent
            réglages = this.service.litRéglagesVueTable(this.defRéglagesVueTable.nom);
            id = this.defRéglagesVueTable.id;
        }
        const attente = this.service.attenteService.attente('chargeVueTable');
        attente.commence();
        this.vueTable.initialise(liste, réglages, id);
        attente.finit();
    }

    ngOnInit() {
        const pageTableDef = this.créePageTableDef();
        if (pageTableDef.avantChargeData) { pageTableDef.avantChargeData(); }

        this.subscriptions.push(
            this.route.data.subscribe((data: Data) => {
                pageTableDef.chargeData(data);
                if (pageTableDef.initialiseUtile) { pageTableDef.initialiseUtile(); }
                this.créeTitrePage();
                pageTableDef.créeSuperGroupe();
                pageTableDef.chargeGroupe();
                if (pageTableDef.aprèsChargeData) { pageTableDef.aprèsChargeData(); }

                if (this.vueTable.id) {
                    this.subscriptions.push(
                        this.route.fragment.subscribe(
                            fragment => {
                                this.fragment = fragment;
                                const choisie = this.vueTable.ligneParId(fragment);
                                if (choisie) {
                                    this.vueTable.activeLigne(choisie);
                                    choisie.géreCss.ajouteClasseTemp(KfBootstrap.classe('alert', 'primary'), 1500);
                                }
                            }
                        )
                    );
                }
            })
        );
    }

    ngAfterViewInit() {
        try {
            document.querySelector('#' + this.fragment).scrollIntoView();
        } catch (e) { }
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
        if (this.defRéglagesVueTable && this.vueTable.visible) {
            this.service.fixeRéglagesVueTable(this.defRéglagesVueTable.nom, this.vueTable.réglages(this.defRéglagesVueTable.id));
        }
    }

}
