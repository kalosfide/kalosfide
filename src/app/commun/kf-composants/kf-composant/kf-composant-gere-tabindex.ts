import {
    KfEvenement, KfTypeDEvenement,
    KfStatutDEvenement
} from '../kf-partages/kf-evenements';
import { KfComposant } from './kf-composant';
import { KfClavierTouche } from '../kf-partages/kf-clavier/kf-clavier-touche';

/**
 * certains composants: liste, menu, radios, peuvent gérer les tabIndex de leurs contenus
 *
 * si la navigation au clavier est activée, le conteneur a un contenu qui le représente pour le focus lors d'une arrivée par tab
 */
export interface KfGereTabIndexInterface {
    /**
     * sous composants qui peuvent prendre le focus
     */
    contenus: () => KfComposant[];
    haut?: (contenu: KfComposant) => KfComposant;
    bas?: (contenu: KfComposant) => KfComposant;
    gauche?: (contenu: KfComposant) => KfComposant;
    droite?: (contenu: KfComposant) => KfComposant;
    liéAChoisi?: () => KfComposant;
}
export class KfGereTabIndex {
    composant: KfComposant;

    pContenus: () => KfComposant[]; // sous composants qui peuvent prendre le focus

    /**
     * fixé dans rafraichit (à appeler quand les contenus ou enCours changent)
     * modifié dans le traitement de blur et focus
     * dernier contenu qui a eu le focus ou contenu qui a le focus
     * si navigation au clavier, contenu qui représente le composant pour le focus
     */
    contenuDuFocus: KfComposant;

    haut: (contenu: KfComposant) => KfComposant;
    bas: (contenu: KfComposant) => KfComposant;
    gauche: (contenu: KfComposant) => KfComposant;
    droite: (contenu: KfComposant) => KfComposant;
    liéAChoisi: () => KfComposant;

    constructor(composant: KfComposant, tabIndexInterface: KfGereTabIndexInterface) {
        this.composant = composant;
        this.pContenus = tabIndexInterface.contenus;
        this.liéAChoisi = tabIndexInterface.liéAChoisi;
        this.haut = tabIndexInterface.haut ? tabIndexInterface.haut : (contenu: KfComposant) => this.precedent(contenu);
        this.droite = tabIndexInterface.droite ? tabIndexInterface.droite : this.haut;
        this.bas = tabIndexInterface.bas ? tabIndexInterface.bas : (contenu: KfComposant) => this.suivant(contenu);
        this.gauche = tabIndexInterface.gauche ? tabIndexInterface.gauche : this.bas;
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.focus,
            (evenement: KfEvenement) => {
                if (this.traiteFocusPris(evenement.emetteur)) {
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
        );
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.blur,
            (evenement: KfEvenement) => {
                if (this.traiteFocusPerdu()) {
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
        );
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.keydown,
            (evenement: KfEvenement) => {
                if (this.traiteToucheBaissee(evenement)) {
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
        );
    }

    get contenus(): KfComposant[] {
        return this.pContenus();
    }

    index(contenu: KfComposant): number {
        return this.contenus.indexOf(contenu);
    }

    suivant(contenu: KfComposant) {
        const contenus = this.pContenus();
        if (contenus && contenus.length > 0) {
            let index = this.index(contenu);
            index = !(index >= 0 && index < contenus.length - 1) ? 0 : index + 1;
            return this.contenus[index];
        } else {
            return this.composant;
        }
    }

    precedent(contenu: KfComposant) {
        const contenus = this.pContenus();
        if (contenus && contenus.length > 0) {
            let index = this.index(contenu);
            index = !(index > 0 && index <= contenus.length - 1) ? 0 : index - 1;
            return this.contenus[index];
        } else {
            return this.composant;
        }
    }

    initialise() {
        const contenus = this.contenus;
        if (this.liéAChoisi) {
            this.contenuDuFocus = this.liéAChoisi();
        }
        if (!this.contenuDuFocus && contenus.length > 0) {
            this.contenuDuFocus = contenus[0];
        }
        contenus.forEach(c => {
            if (c.gereHtml.htmlElement) {
                c.gereHtml.htmlElement.tabIndex = c === this.contenuDuFocus ? 0 : -1;
            }
        });
    }

    prendLeFocus(): boolean {
        if (this.contenuDuFocus) {
            return this.contenuDuFocus.prendLeFocus();
        }
        return false;
    }

    // TRAITEMENT DES EVENEMENTS
    traiteFocusPris(emetteur: KfComposant): boolean {
        const contenus = this.pContenus();
//        console.log('focus pris', emetteur);
        if (contenus.find(c => c === emetteur)) {
            if (emetteur !== this.contenuDuFocus) {
                if (this.contenuDuFocus) {
                    this.contenuDuFocus.tabIndex = -1;
                }
                this.contenuDuFocus = emetteur;
                this.contenuDuFocus.tabIndex = 0;
            }
            return true;
        }
    }
    traiteFocusPerdu(): boolean {
//        console.log('focus perdu', emetteur);
        //        this.contenuDuFocus = emetteur;
        return true;
    }

    traiteToucheBaissee(evenement: KfEvenement) {
        const event: KeyboardEvent = evenement.parametres;
        let traité = false;
        const ancien = this.contenuDuFocus;
        let nouveau: KfComposant;
        switch (event.key as KfClavierTouche) {
            case 'Down':
            case 'ArrowDown':
                nouveau = this.bas(ancien);
                traité = true;
                break;
            case 'Left':
            case 'ArrowLeft':
                nouveau = this.gauche(ancien);
                traité = true;
                break;
            case 'Right':
            case 'ArrowRight':
                nouveau = this.droite(ancien);
                traité = true;
                break;
            case 'Up':
            case 'ArrowUp':
                nouveau = this.haut(ancien);
                traité = true;
                break;
            default:
                break;
        }
//        console.log(ancien, nouveau);
        if (nouveau && nouveau !== ancien) {
            if (this.liéAChoisi) {
                // transforme en clic
                nouveau.gereHtml.htmlElement.click();
            }
            nouveau.gereHtml.htmlElement.focus();
        }
        return traité;
    }

    // _contenus() ou _liéAChoisi ont changé
    // il faut mettre à jour contenuDuFocus et les tabIndex
    rafraichit() {
        const contenus = this.pContenus();
        if (this.liéAChoisi) {
            this.contenuDuFocus = this.liéAChoisi();
        } else {
            if (!this.contenuDuFocus) {
                this.contenuDuFocus = contenus[0];
            }
        }
        contenus.forEach(c => c.tabIndex = c === this.contenuDuFocus ? 0 : -1);
    }

}
