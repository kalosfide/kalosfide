import { KfVueTable } from '../../commun/kf-composants/kf-vue-table/kf-vue-table';

import { PageBaseComponent } from '../page-base/page-base.component';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Data, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { OnInit, OnDestroy, AfterViewInit, Component } from '@angular/core';
import { GroupeTable, IGroupeTableDef } from './groupe-table';
import { IPageTableDef } from './i-page-table-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

@Component({ template: '' })
export abstract class PageTableComponent<T> extends PageBaseComponent implements OnInit, OnDestroy, AfterViewInit {

    liste: T[] = [];

    groupeTable: GroupeTable<T>;

    get vueTable(): KfVueTable<T> {
        return this.groupeTable.vueTable;
    }

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

    protected chargeGroupe() {
        this._chargeVueTable(this.liste);
    }

    protected _chargeVueTable(liste: T[]) {
        const attente = this.service.attenteService.attente('chargeVueTable');
        attente.commence();
        this.vueTable.initialise(liste);
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
                                const choisie = this.vueTable.ligne(fragment);
                                if (choisie) {
                                    this.vueTable.activeLigne(choisie);
                                    choisie.géreCss.ajouteClasseTemp('table-active', 30000);
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
    }

}
