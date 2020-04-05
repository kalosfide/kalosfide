/**
 * class KfComposant
 *
 *  Les KfComposants sont des précurseurs d'Angular components. Prééxistants aux components, ils créent les objets
 *  necessaires avant d'être injectés dans leur component avec @Input
 *
 * structure:
 *  les KfComposants sont les noeuds d'un arbre.
 *  KfConteneur: KfComposant qui a des enfants
 *
 * components:
 *
 */
import { AbstractControl } from '@angular/forms';

import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { Noeud } from '../../outils/arbre/noeud';
import { KfListe } from '../kf-liste/kf-liste';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfComposantGereHtml } from './kf-composant-gere-html';
import { KfComposantGereVisible } from './kf-composant-gere-visible';
import { KfGereTabIndex } from './kf-composant-gere-tabindex';
import { KfContenuPhrase } from '../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';
import { KfValidateur } from '../kf-partages/kf-validateur';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfImageDef } from '../kf-partages/kf-image-def';
import { IKfVueTable } from '../kf-vue-table/kf-vue-table';
import { FANomIcone } from '../kf-partages/kf-icone-def';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { Subscription, Observable } from 'rxjs';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';
import { KfDiv } from '../kf-partages/kf-div/kf-div';

export interface IKfComposant {
    composant: KfComposant;
}
export abstract class KfComposant extends KfGéreCss implements IKfComposant {
    // GENERAL
    /**
     * nom: string
     *  requis:
     *      pour lier le KfComposant à son AbstractControl
     *      pour lier le KfComposant à sa valeur
     *      pour trouver un KfComposant enfant ou descendant
     */
    nom: string;

    /**
     * type: TypeDeComposant
     *  détermine quel Angular component doit afficher ce KfComposant
     *  est fixé par le constructeur des classes dérivées non abstraites
     */
    type: KfTypeDeComposant;

    // STRUCTURE
    /**
     * STRUCTURE
     *  les KfComposants sont les objets des noeuds d'un arbre.
     *  on appelle <app-kf-composant [composant]="racine"> pour rendre l'arbre.
     * Si le template parent est rendu
     */
    noeud: Noeud;

    /**
     * listeParent:
     *  lorsqu'un composant est destiné à une liste, il faut renseigner ce champ
     */
    listeParent: KfListe | IKfVueTable;

    // VALEUR
    /**
     * _valeur: any
     *
     *   seuls les composants éditables racine doivent définir _valeur
     *   ils le font avec la méthode initialise
     *
     *   la valeur d'un composant éditable racine qui a défini _valeur est: _valeur
     *   la valeur d'un composant éditable est indéfinie si sa racine n'a pas défini sa _valeur
     *   c'est: GroupeAvecValeur.valeur[composant.nom] si composant est le descendant d'un groupe avec valeur
     *
     */
    gereValeur: KfComposantGereValeur;
    /**
     * estRacineV: si vrai, à fixer avant quandTousAjoutés
     */
    get estRacineV(): boolean {
        return this.gereValeur && this.gereValeur.estRacineV;
    }
    set estRacineV(valeur: boolean) {
        if (this.gereValeur) {
            this.gereValeur.estRacineV = valeur;
        }
    }

    // HTML

    /**
     * pour diminuer la taille de ce fichier, les éléments HTML du template et leurs évènements sont gérés
     * dans un objetspécialisé
     */
    gereHtml: KfComposantGereHtml;

    /**
     * pour diminuer la taille de ce fichier, tabIndex et focus et leurs évènements sont gérés
     * dans un objetspécialisé
     */
    gereTabIndex: KfGereTabIndex;

    /**
     * si vrai, le template du composant sera suivi d'un <br>
     * implémenté par KfEtiquette si pas dans balises, par KfTexte
     */
    suiviDeSaut: boolean;

    /**
     * contenu phrasé de l'element ou de son label
     */
    private _contenuPhrase?: KfContenuPhrase;
    // pour debug
    get contenuPhrase(): KfContenuPhrase {
        return this._contenuPhrase;
    }
    set contenuPhrase(contenuPhrase: KfContenuPhrase) {
        this._contenuPhrase = contenuPhrase;
    }

    /**
     * pour entourer le template du composant dans un ou des éléments div
     */
    private _div: KfDiv;
    get div(): KfDiv {
        return this._div;
    }

    /**
     * pour désigner le composant dans les messages
     */
    private _nomPourErreur: string;

    /**
     * title de l'element
     */
    private _titleHtml: string;

    /**
     * voir visible
     */
    gereVisible: KfComposantGereVisible;

    /**
     * voir inactif
     */
    private _inactivité: boolean;
    private _inactivitéFnc: () => boolean;
    private _subscriptionInactif: Subscription;

    constructor(nom: string, type: KfTypeDeComposant) {
        super();
        this.nom = nom;
        this.type = type;
        this.noeud = new Noeud();
        this.noeud.objet = this;
        this.gereVisible = new KfComposantGereVisible(this);
        this.gereHtml = new KfComposantGereHtml(this);
    }

    /**
     * implémentation de IKfComposant
     */
    get composant(): KfComposant {
        return this;
    }

    /**
     * typeDeValeur: TypeDeValeur
     *  détermine si le KfComposant doit avoir un AbstractControl et de quel type
     *  détermine si le KfComposant doit avoir une valeur et de quel type
     *  est fixé par le constructeur des classes dérivées non abstraites
     *  est modifié pour un groupe dont les éléments sont sans valeur
     */
    get typeDeValeur(): KfTypeDeValeur {
        return this.gereValeur ? this.gereValeur.typeDeValeur : KfTypeDeValeur.aucun;
    }

    // STRUCTURE
    get parent(): KfComposant {
        if (this.noeud.parent) {
            return this.noeud.parent.objet as KfComposant;
        } else {
            return null;
        }
    }
    get racine(): KfComposant {
        return this.noeud.racine.objet as KfComposant;
    }

    get estDansListe(): boolean {
        return !!(this.listeParent);
    }

    get estDansVueTable(): boolean {
        if (this.listeParent) {
            return this.listeParent.composant.type === KfTypeDeComposant.vuetable;
        }
        if (this.parent) {
            return this.parent.estDansVueTable;
        }
    }

    ascendantVérifiant(vérifie: (c: KfComposant) => boolean): KfComposant {
        let p = this.parent;
        while (p) {
            if (vérifie(p)) {
                return p;
            }
            p = p.parent;
        }
        return null;
    }

    /* A N'UTILISER QU'APRES QUE LA RACINE DU COMPOSANT A APPELE créeValeur */
    get groupeParent(): KfGroupe {
        let c = this.parent;
        while (c) {
            if (c.typeDeValeur === KfTypeDeValeur.avecGroupe) {
                break;
            }
            c = c.parent;
        }
        return c as KfGroupe;
    }

    get formulaireParent(): KfSuperGroupe {
        const gp = this.groupeParent;
        if (gp) {
            return gp.noeud.racine.objet as KfSuperGroupe;
        }
    }

    /**
     * ajoute un composant à rendre dans le template de ce composant
     * @param composant le composant à ajouter
     */
    ajoute(composant: KfComposant) {
        if (composant.noeud.parent) {
            throw new Error(`Le composant ${composant.nom} a déjà un parent.`);
        }
        this.noeud.Ajoute(composant.noeud);
    }

    get contenus(): KfComposant[] {
        return this.enfants;
    }

    contenu(nom: string): KfComposant {
        return this.contenus.find(c => c.nom === nom);
    }

    get enfants(): KfComposant[] {
        return this.noeud.ObjetsEnfants().map<KfComposant>(objet => objet as KfComposant);
    }

    enfant(nom: string): KfComposant {
        return this.enfants.find(
            e => e.nom === nom
        );
    }

    descendantDeNom(nom: string): KfComposant {
        const trouvé = this.noeud.Trouve(
            (n: Noeud) => (n.objet as KfComposant).nom === nom
        );
        return (trouvé.length > 0) ? trouvé[0] as KfComposant : null;
    }

    descendantDeTypeDeValeur(typeDeValeur: KfTypeDeValeur): KfComposant {
        let trouvé = null;
        trouvé = this.noeud.Trouve(
            (n: Noeud) => (n.objet as KfComposant).typeDeValeur === typeDeValeur
        );
        return (trouvé) ? trouvé as KfComposant : null;
    }

    // INFO
    get estRacine(): boolean {
        return !(this.noeud.parent);
    }
    get estFormulaire(): boolean {
        return this.estRacineV && this.estGroupePourLaValeur && !!this.gereValeur;
    }
    get estGroupePourLaValeur(): boolean {
        return this.type === KfTypeDeComposant.groupe || this.type === KfTypeDeComposant.b_btn_toolbar;
    }
    get estListe(): boolean {
        return this.type === KfTypeDeComposant.liste;
    }
    get estVueTable(): boolean {
        return this.type === KfTypeDeComposant.vuetable;
    }
    get estElement(): boolean {
        return !this.estGroupePourLaValeur && !this.estListe && !this.estVueTable;
    }
    get estEntree(): boolean {
        return this.estElement && this.typeDeValeur !== KfTypeDeValeur.aucun;
    }

    // VALEUR

    /* A N'UTILISER QU'APRES QUE LA RACINE DU COMPOSANT A APPELE créeValeur */
    get valeurDansParent(): any {
        if (this.groupeParent) {
            const v = this.groupeParent.valeurDansParent;
            if (v) {
                return v[this.nom];
            }
        }
    }
    /* A N'UTILISER QU'APRES QUE LA RACINE DU COMPOSANT A APPELE créeValeur */
    set valeurDansParent(valeur: any) {
        if (this.groupeParent) {
            const v = this.groupeParent.valeurDansParent;
            if (v) {
                v[this.nom] = valeur;
            }
        }
    }

    /* VALIDATION */

    ajouteValidateur(validateur: KfValidateur) {
        if (this.gereValeur) {
            this.gereValeur.AjouteValidateur(validateur);
        }
    }

    get erreurs(): string[] {
        if (this.gereValeur) {
            return this.gereValeur.erreurs;
        }
    }

    get estInvalide(): boolean {
        return this.gereValeur && this.gereValeur.invalide;
    }

    get nomPourErreur(): string {
        if (this._nomPourErreur) {
            return this._nomPourErreur;
        }
        const t = this.texte;
        if (t) {
            return t;
        }
        return this.nom;
    }
    set nomPourErreur(nom: string) {
        this._nomPourErreur = nom;
    }

    get avecInvalidFeedback(): boolean {
        if (this.parent) {
            return this.parent.avecInvalidFeedback;
        }
    }

    // INTERFACE

    get abstractControl(): AbstractControl {
        if (this.gereValeur) {
            return this.gereValeur.abstractControl;
        }
    }

    private _active(inactivité: boolean) {
        this._inactivité = inactivité;
        if (this.abstractControl) {
            if (inactivité) {
                this.abstractControl.enable();
            } else {
                this.abstractControl.disable();
            }
        }
    }
    active() {
        this._active(false);
    }
    désactive() {
        this._active(true);
    }

    /**
     *  méthodes pour fixer la façon de déterminer l'activité
     */
    set inactivité(inactivité: boolean) {
        this._inactivité = inactivité;
        this._active(inactivité);
    }
    set inactivitéFnc(inactivitéFnc: () => boolean) {
        this._inactivitéFnc = inactivitéFnc;
        this._active(inactivitéFnc());
    }
    set inactivitéObs(inactivitéObs: Observable<boolean>) {
        if (this._subscriptionInactif) {
            this._subscriptionInactif.unsubscribe();
        }
        this._subscriptionInactif = inactivitéObs.subscribe(inactif => {
            this._active(inactif);
        });
    }
    set inactivitéIO(inactivitéIO: KfInitialObservable<boolean>) {
        this.inactivité = inactivitéIO.valeur;
        this.inactivitéObs = inactivitéIO.observable;
    }

    /**
     * permet d'affecter l'attribut disabled au DOM element
     */
    get inactif(): boolean {
        let inactif = (this._inactivitéFnc)
            ? this._inactivitéFnc()
            : this._inactivité; // si l'inactivité dépend d'un observable elle a été fixée
        inactif = (this.abstractControl && this.abstractControl.disabled)
            || (this.parent && this.parent.inactif)
            || (this.listeParent && this.listeParent.composant.inactif)
            || inactif;
        return inactif;
    }

    // HTML

    enveloppeDiv(): KfDiv {
        if (!this._div) {
            this._div = KfDiv.enveloppe(this);
            return this._div;
        } else {
            return KfDiv.ajouteA(this._div);
        }
    }

    get tabIndex(): number {
        return this.gereHtml.tabIndex;
    }
    set tabIndex(tabIndex: number) {
        this.gereHtml.tabIndex = tabIndex;
    }

    get parentPourTabIndex(): KfComposant {
        let parent = this.listeParent ? this.listeParent.composant : this.parent;
        if (parent) {
            if (!parent.composant.gereTabIndex) {
                parent = parent.composant.parentPourTabIndex;
            }
        }
        return parent;
    }
    get gereTabIndexParent(): KfGereTabIndex {
        const parent = this.parentPourTabIndex;
        if (parent && parent.gereTabIndex.contenus.find(c => c === this)) {
            return parent.gereTabIndex;
        }
    }

    /**
     * balises Html à ajouter dans le template autour de la partie rendant le composant
     */

    prendLeFocus(): boolean {
        if (this.gereHtml.prendLeFocus()) {
            return true;
        }
        if (this.gereTabIndex) {
            return this.gereTabIndex.prendLeFocus();
        }
    }

    /**
     * retourne le texte de l'element ou de son label si l'élément est équivalent à un label ou a un label
     * surcharge: KfTexte, KfIcone
     */
    get texte(): string {
        if (this.contenuPhrase) {
            return this.contenuPhrase.texte;
        }
    }
    /**
     * fixe le texte de l'element ou de son label
     * surcharge: KfTexte
     */
    fixeTexte(texte: KfTexteDef) {
        if (!this.contenuPhrase) {
            throw new Error(`Ce composant n'a pas de contenu phrasé.`);
        } else {
            this.contenuPhrase.fixeTexte(texte);
        }
    }

    /**
     * retourne l'image de l'element ou de son label si l'élément est équivalent à un label ou a un label
     */
    get image(): KfImageDef {
        if (this.contenuPhrase) {
            return this.contenuPhrase.imageDef;
        }
    }
    /**
     * fixe l'image de l'element ou de son label
     */
    fixeImage(image: KfImageDef) {
        if (!this.contenuPhrase) {
            throw new Error(`Ce composant n'a pas de contenu phrasé.`);
        } else {
            this.contenuPhrase.fixeImage(image);
        }
    }

    /**
     * retourne l'icone de l'element ou de son label si l'élément est équivalent à un label ou a un label
     */
    get icone(): FANomIcone {
        if (this.contenuPhrase) {
            return this.contenuPhrase.icone;
        }
    }
    /**
     * fixe le icone de l'element ou de son label
     */
    fixeIcone(icone: FANomIcone) {
        if (!this.contenuPhrase) {
            throw new Error(`Ce composant n'a pas de contenu phrasé.`);
        } else {
            this.contenuPhrase.fixeIcone(icone);
        }
    }


    /**
     * title de l'element
     */
    get titleHtml(): string {
        return this._titleHtml;
    }
    set titleHtml(titleHtml: string) {
        this._titleHtml = titleHtml;
        if (this.gereHtml.htmlElement) {
            this.gereHtml.htmlElement.title = titleHtml;
        }
    }

    // avec disposition
    ajouteAValeur(parentV: KfComposant) {
        parentV.gereValeur.ajoute(this.gereValeur);
    }

}
