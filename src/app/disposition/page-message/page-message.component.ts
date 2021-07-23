import { PageDef } from 'src/app/commun/page-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from '../fabrique/fabrique';
import { Component, OnInit } from '@angular/core';

@Component({ template: '' })
export abstract class PageMessageComponent implements OnInit {
    titrePage: KfGroupe;

    abstract pageDef: PageDef;
    abstract messages: string[];

    protected créeTitrePage() {
        this.titrePage = Fabrique.titrePage.titrePage(this.titre, 0);
    }
     ngOnInit() {
         this.créeTitrePage();
     }

    get titre(): string {
        return this.pageDef.titre;
    }
}
