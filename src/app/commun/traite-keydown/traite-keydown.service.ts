import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TraiteKeydownService {

    constructor() {
    }

    quandFocusPris(event: FocusEvent) {
        console.log(event);
    }

    /**
     * Un composant qui veut traiter les touches baissées s'inscrit et se désinscrit  de ce service quand l'htmlElement d'un de ses
     * sous KfGereHtml prend ou perd le focus.
     * Les KeyboardEvent du document sont transmis à ce service qui les envoie au traiteur.
     */
    private pTraiteurDuFocus: (event: KeyboardEvent) => boolean;

    traiteurParDéfaut: (event: KeyboardEvent) => boolean;

    get traiteurDuFocus(): (event: KeyboardEvent) => boolean {
        return this.pTraiteurDuFocus;
    }
    set traiteurDuFocus(traiteurDuFocus: (event: KeyboardEvent) => boolean) {
        if (this.pTraiteurDuFocus === undefined && traiteurDuFocus === undefined) {
            return
        }
        this.pTraiteurDuFocus = traiteurDuFocus;
        console.log('set traiteurDuFocus ' + (this.pTraiteurDuFocus === undefined ? 'indéfini' : 'défini'));
    }

    traiteToucheEnfoncée(event: KeyboardEvent): boolean {
        let traité = false;
        console.log('traiteToucheEnfoncée: traiteurDuFocus ' + (this.pTraiteurDuFocus === undefined ? 'indéfini' : 'défini'));
        if (!event.key) {
            return traité;
        }
        if (this.pTraiteurDuFocus) {
            traité = this.pTraiteurDuFocus(event);
        }
        if (!traité) {
            if (this.traiteurParDéfaut) {
                traité = this.traiteurParDéfaut(event);
            }
        }
        return traité;
    }

}
