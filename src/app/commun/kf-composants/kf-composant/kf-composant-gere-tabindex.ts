import {
    KfEvenement, KfTypeDEvenement,
    KfTraitementDEvenement, KFTraiteurDEvenement, KfTypeDHTMLEvents, KfTransformateurDEvenement, KfCapteurDEvenement, KfStatutDEvenement
} from '../kf-partages/kf-evenements';
import { KfComposant } from './kf-composant';
import { KfDocumentContexte } from '../kf-constantes';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton, KfTypeDeComposant, KfKeyboardKey } from '../kf-composants-types';
import { KfComposantGereHtml } from './kf-composant-gere-html';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';

/**
 * certains composants: liste, menu, radios, peuvent gérer les tabIndex de leurs contenus
 *
 * si la navigation au clavier est activée, le conteneur a un contenu qui le représente pour le focus lors d'une arrivée par tab
 */
export interface KfGereTabIndexInterface {
    contenus: () => KfComposant[]; // sous composants qui peuvent prendre le focus
    haut?: (contenu: KfComposant) => KfComposant;
    bas?: (contenu: KfComposant) => KfComposant;
    gauche?: (contenu: KfComposant) => KfComposant;
    droite?: (contenu: KfComposant) => KfComposant;
    liéAChoisi?: () => KfComposant;
}
export class KfGereTabIndex {
    composant: KfComposant;

    _contenus: () => KfComposant[]; // sous composants qui peuvent prendre le focus

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
        this._contenus = tabIndexInterface.contenus;
        this.liéAChoisi = tabIndexInterface.liéAChoisi;
        this.haut = tabIndexInterface.haut ? tabIndexInterface.haut : (contenu: KfComposant) => this.precedent(contenu);
        this.droite = tabIndexInterface.droite ? tabIndexInterface.droite : this.haut;
        this.bas = tabIndexInterface.bas ? tabIndexInterface.bas : (contenu: KfComposant) => this.suivant(contenu);
        this.gauche = tabIndexInterface.gauche ? tabIndexInterface.gauche : this.bas;
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.focusPris,
            (evenement: KfEvenement) => {
                if (this.traiteFocusPris(evenement.emetteur)) {
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
        );
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.focusPerdu,
            (evenement: KfEvenement) => {
                if (this.traiteFocusPerdu(evenement.emetteur)) {
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
        );
        this.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.toucheBaissee,
            (evenement: KfEvenement) => {
                if (this.traiteToucheBaissee(evenement)) {
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
        );
    }

    get contenus(): KfComposant[] {
        return this._contenus();
    }

    index(contenu: KfComposant): number {
        return this.contenus.indexOf(contenu);
    }

    suivant(contenu: KfComposant) {
        const contenus = this._contenus();
        if (contenus && contenus.length > 0) {
            let index = this.index(contenu);
            index = !(index >= 0 && index < this.contenus.length - 1) ? 0 : index + 1;
            return this.contenus[index];
        } else {
            return this.composant;
        }
    }

    precedent(contenu: KfComposant) {
        const contenus = this._contenus();
        if (contenus && contenus.length > 0) {
            let index = this.index(contenu);
            index = !(index > 0 && index <= this.contenus.length - 1) ? 0 : index - 1;
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
        const contenus = this._contenus();
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
    traiteFocusPerdu(emetteur: KfComposant): boolean {
//        console.log('focus perdu', emetteur);
        //        this.contenuDuFocus = emetteur;
        return true;
    }

    traiteToucheBaissee(evenement: KfEvenement) {
        const event: KeyboardEvent = evenement.parametres;
        let traité = false;
        const ancien = this.contenuDuFocus;
        let nouveau: KfComposant;
        switch (event.key) {
            case KfKeyboardKey.down:
            case KfKeyboardKey.arrowDown:
                nouveau = this.bas(ancien);
                traité = true;
                break;
            case KfKeyboardKey.left:
            case KfKeyboardKey.arrowLeft:
                nouveau = this.gauche(ancien);
                traité = true;
                break;
            case KfKeyboardKey.right:
            case KfKeyboardKey.arrowRight:
                nouveau = this.droite(ancien);
                traité = true;
                break;
            case KfKeyboardKey.up:
            case KfKeyboardKey.arrowUp:
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
        const contenus = this._contenus();
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
