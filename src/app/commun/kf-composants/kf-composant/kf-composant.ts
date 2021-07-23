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
import { KfGereTabIndex } from './kf-composant-gere-tabindex';
import { KfContenuPhrase } from '../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfComposantGereValeur } from './kf-composant-gere-valeur';
import { KfValidateur } from '../kf-partages/kf-validateur';
import { KfStringDef } from '../kf-partages/kf-string-def';
import { KfImageDef } from '../kf-partages/kf-image-def';
import { IKfVueTable } from '../kf-vue-table/kf-vue-table';
import { IKfIconeDef } from '../kf-partages/kf-icone-def';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { Subscription, Observable } from 'rxjs';
import { ValeurEtObservable } from '../../outils/valeur-et-observable';
import { KfDiv } from '../kf-partages/kf-div/kf-div';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';
import { EventEmitter } from '@angular/core';
import { KfEvenement } from '../kf-partages/kf-evenements';
import { TraiteKeydownService } from '../../traite-keydown/traite-keydown.service';

export interface IKfComposant {
    composant: KfComposant;
    classe: KfNgClasse;
    style: KfNgStyle;
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
    private pContenuPhrase?: KfContenuPhrase;
    // pour debug
    get contenuPhrase(): KfContenuPhrase {
        return this.pContenuPhrase;
    }
    set contenuPhrase(contenuPhrase: KfContenuPhrase) {
        this.pContenuPhrase = contenuPhrase;
    }

    /**
     * pour désigner le composant dans les messages
     */
    private pNomPourErreur: string;

    /**
     * voir inactif
     */
    private pInactivité: boolean;
    private pInactivitéFnc: () => boolean;
    private pSubscriptionInactif: Subscription;


    traiteKeydownService: TraiteKeydownService;

    constructor(nom: string, type: KfTypeDeComposant) {
        super();
        this.nom = nom;
        this.type = type;
        this.noeud = new Noeud();
        this.noeud.objet = this;
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

    get formulaireParent(): KfGroupe {
        let c = this.parent;
        while (c) {
            if (c.typeDeValeur === KfTypeDeValeur.avecGroupe && c.estRacineV) {
                break;
            }
            c = c.parent;
        }
        return c as KfGroupe;
    }

    /**
     * ajoute un composant à rendre dans le template de ce composant
     * @param composant le composant à ajouter
     */
    ajoute(composant: KfComposant) {
        if (composant.noeud.parent) {
            throw new Error(`Le composant ${composant.nom} a déjà un parent ${composant.parent.nom}.`);
        }
        if (composant.type === KfTypeDeComposant.radio && this.type !== KfTypeDeComposant.radios) {
            throw new Error(`Un composant de type ${KfTypeDeComposant.radio} ne peut être ajouté à ${this.nom} qui n'est pas de type ${KfTypeDeComposant.radios}.`);
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
    /**
     * Est vrai si le composant est le superGroupe racine de l'arbre de disposition.
     */
    get estRacine(): boolean {
        return !(this.noeud.parent);
    }
    /**
     * Est vrai si le composant est la racine d'un arbre de valeur.
     * A fixer avant d'appeler quandTousAjoutés du superGroupe racine de l'arbre de disposition.
     */
     get estRacineV(): boolean {
        return this.gereValeur && this.gereValeur.estRacineV;
    }
    set estRacineV(valeur: boolean) {
        if (this.gereValeur) {
            this.gereValeur.estRacineV = valeur;
        }
    }
    /**
     * Est vrai si le composant est un groupe qui est la racine d'un arbre de valeur.
     */
    get estFormulaire(): boolean {
        return this.estRacineV && this.type === KfTypeDeComposant.groupe && !!this.gereValeur;
    }
    get estGroupe(): boolean {
        return this.type === KfTypeDeComposant.groupe;
    }
    get estListe(): boolean {
        return this.type === KfTypeDeComposant.liste;
    }
    get estVueTable(): boolean {
        return this.type === KfTypeDeComposant.vuetable;
    }
    get estElement(): boolean {
        return !this.estGroupe && !this.estListe && !this.estVueTable;
    }
    get estEntree(): boolean {
        return this.estElement && this.typeDeValeur !== KfTypeDeValeur.aucun;
    }

    // VALEUR

    /* VALIDATION */

    ajouteValidateur(...validateurs: KfValidateur[]) {
        if (this.gereValeur) {
            this.gereValeur.ajouteValidateur(...validateurs);
        }
    }

    get erreurs(): string[] {
        if (this.gereValeur) {
            return this.gereValeur.erreurs;
        }
    }

    get estValidable(): boolean {
        return this.gereValeur && this.gereValeur.validateurs && this.gereValeur.validateurs.length > 0;
    }


    get estInvalide(): boolean {
        return this.gereValeur && this.gereValeur.invalide;
    }
    get nomPourErreur(): string {
        if (this.pNomPourErreur) {
            return this.pNomPourErreur;
        }
        const t = this.texte;
        if (t) {
            return t;
        }
        return this.nom;
    }
    set nomPourErreur(nom: string) {
        this.pNomPourErreur = nom;
    }

    get avecInvalidFeedback(): boolean {
        if (this.parent && !this.estDansVueTable) {
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
        this.pInactivité = inactivité;
        if (this.abstractControl) {
            if (inactivité) {
                this.abstractControl.disable();
            } else {
                this.abstractControl.enable();
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
        this.pInactivité = inactivité;
        this._active(inactivité);
    }
    set inactivitéFnc(inactivitéFnc: () => boolean) {
        this.pInactivitéFnc = inactivitéFnc;
        this._active(inactivitéFnc());
    }
    set inactivitéObs(inactivitéObs: Observable<boolean>) {
        if (this.pSubscriptionInactif) {
            this.pSubscriptionInactif.unsubscribe();
        }
        this.pSubscriptionInactif = inactivitéObs.subscribe(inactif => {
            this._active(inactif);
        });
    }
    set inactivitéIO(inactivitéIO: ValeurEtObservable<boolean>) {
        this.inactivité = inactivitéIO.valeur;
        this.inactivitéObs = inactivitéIO.observable;
    }

    /**
     * permet d'affecter l'attribut disabled au DOM element
     */
    get inactif(): boolean {
        let inactif = (this.pInactivitéFnc)
            ? this.pInactivitéFnc()
            : this.pInactivité; // si l'inactivité dépend d'un observable elle a été fixée
        inactif = (this.abstractControl && this.abstractControl.disabled)
            || (this.parent && this.parent.inactif)
            || (this.listeParent && this.listeParent.composant.inactif)
            || inactif;
        return inactif;
    }

    // HTML

    initialiseHtml(htmlElement: HTMLElement, output: EventEmitter<KfEvenement>) {
        this.gereHtml.htmlElement = htmlElement;
        this.gereHtml.initialiseHtml(output);
    }

    get tabIndex(): number {
        return this.gereHtml.tabIndex;
    }
    set tabIndex(tabIndex: number) {
        this.gereHtml.tabIndex = tabIndex;
    }

    get gereTabIndexParent(): KfGereTabIndex {
        const ascendantAvecGereTabIndex: (composant: KfComposant) => KfComposant =
            (composant: KfComposant) => {
                const parent = composant.listeParent ? composant.listeParent.composant : composant.parent;
                if (parent) {
                    if (parent.gereTabIndex) {
                        return parent;
                    } else {
                        return ascendantAvecGereTabIndex(parent);
                    }
                }
            };
        const ascendant = ascendantAvecGereTabIndex(this);
        if (ascendant && ascendant.gereTabIndex.contenus.find(c => c === this)) {
            return ascendant.gereTabIndex;
        }
    }

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
    fixeTexte(texte: KfStringDef) {
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
    get icone(): IKfIconeDef {
        if (this.contenuPhrase) {
            return this.contenuPhrase.icone;
        }
    }
    /**
     * fixe l'icone de l'element ou de son label
     */
    fixeIcone(icone: IKfIconeDef) {
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
        return this.gereHtml.titleHtml;
    }
    set titleHtml(titleHtml: string) {
        this.gereHtml.titleHtml = titleHtml;
    }

    // avec disposition
    ajouteAValeur(parentV: KfComposant) {
        parentV.gereValeur.ajoute(this.gereValeur);
    }

}
