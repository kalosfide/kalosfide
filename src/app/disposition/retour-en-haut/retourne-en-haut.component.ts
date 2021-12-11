import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { IBoutonDef } from '../fabrique/fabrique-bouton';
import { Fabrique } from '../fabrique/fabrique';

@Component({
    selector: 'app-retour-en-haut',
    templateUrl: './retour-en-haut.component.html',
})
export class RetourEnHautComponent implements OnInit {
    windowScrolled: boolean;

    groupe: KfGroupe;

    constructor(@Inject(DOCUMENT) private document: Document) { }

    @HostListener('window:scroll', [])

    onWindowScroll() {
        if (window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop > 100) {
            this.windowScrolled = true;
        } else if (this.windowScrolled && window.pageYOffset
            || this.document.documentElement.scrollTop || this.document.body.scrollTop < 10) {
            this.windowScrolled = false;
        }
    }

    ngOnInit() {
        this.groupe = new KfGroupe('retour-en-haut');
        this.groupe.ajouteClasse('retour-en-haut', { nom: 'retour-en-haut-montre', active: () => this.windowScrolled });
        const def: IBoutonDef = {
            nom: 'retour-en-haut',
            action: () => {
                window.scrollTo({top: 0, behavior: 'smooth'});
            },
            contenu: {
                icone: Fabrique.icone.retourEnHaut()
            },
            bootstrap: { type: 'dark' }
        };
        this.groupe.ajoute(Fabrique.bouton.bouton(def));
    }
}
