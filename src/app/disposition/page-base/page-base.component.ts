import { Subscription } from 'rxjs';


import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { Component, OnDestroy } from '@angular/core';
import { KfEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { IBarreTitre } from '../fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../fabrique/fabrique';

@Component({
    template: ''
})
export abstract class PageBaseComponent implements OnDestroy {

    subscriptions: Subscription[] = [];

    /**
     * Si null ou undefined, la page n'a pas de groupe titre
     */
    abstract pageDef: PageDef;

    /**
     * Si pas défini, la page est une page titre et a un routerOutlet
     */
    superGroupe: KfSuperGroupe;

    get nom(): string {
        return this.pageDef.path;
    }

    get titre(): string {
        return this.pageDef.titre;
    }

    titrePage: KfSuperGroupe;
    barre: IBarreTitre;

    niveauTitre: 0 | 1;
    protected créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
        });

        this.barre = barre;
        return barre;
    }

    get avecValeur(): boolean {
        const racinesV = this.superGroupe.racinesV();
        return racinesV && racinesV.length > 0;
    }
    get valeur(): any {
        const v: {[key: string]: any} = {};
        const racinesV = this.superGroupe.racinesV();
        racinesV.forEach(r => v[r.nom] = r.gereValeur.valeur)
        return v;
    }
    

    /**
     * Les classes dérivées doivent avoir un pageDef et appeler créeTitrePage pour avoir un groupe titre
     */
    créeTitrePage() {
        if (!this.pageDef) {
            return;
        }
        this.titrePage = Fabrique.titrePage.titrePage(this.titre, this.niveauTitre,
            this.créeBarreTitre ? this.créeBarreTitre.bind(this) : undefined);
    }

    ngOnDestroy_Subscriptions() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    traite(evenement: KfEvenement) {}

}
