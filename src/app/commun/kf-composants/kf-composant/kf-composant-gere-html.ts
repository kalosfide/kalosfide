import {
    KfEvenement, KfTypeDEvenement,
    KfTraitementDEvenement, KFTraiteurDEvenement, KfTypeDHTMLEvents, KfStatutDEvenement
} from '../kf-partages/kf-evenements';
import { KfComposant } from './kf-composant';
import { KfDocumentContexte } from '../kf-constantes';
import { KfTypeDeComposant } from '../kf-composants-types';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

enum KfKeyboardKey {
    enter = 'Enter',
    space = ' ',
    down = 'ArrowDown',
    left = 'ArrowLeft',
    right = 'ArrowRight',
    up = 'ArrowUp',
}

export class KfComposantGereHtml {
    /**
     * composant dont les html elements sont gérés par this
     */
    composant: KfComposant;

    /**
     * HTMLElement du composant qui emet ses évènements DOM
     */
    htmlElement: HTMLElement;

    enfants: KfComposantGereHtml[];

    private pParent: KfComposantGereHtml;

    /**
     * liste des types d'évènements du DOM que le htmlElement du composant doit déclencher
     * certains sont fixés par le type du composant et les options de this
     * d'autres peuvent être ajoutés par le programmeur
     */
    evenementsADéclencher: KfTypeDHTMLEvents[];

    /**
     *  array des kf event handlers du groupe
     */
    traiteurDEvenements: KFTraiteurDEvenement[];

    /**
     * S'il n'y a pas de composant ou si le composant n'a pas de valeur, est sans effet. 
     * si suitLeStatut, le component emet un KfEvenenment statutChange en réponse à un événement statusChanges de l'abstractControl
     */
    private pSuitLeStatut: boolean;
    private pSubscriptionSuitLeStatut: Subscription;

    /**
     * S'il n'y a pas de composant ou si le composant n'a pas de valeur, est sans effet.
     * Si défini et vrai avant initialiseHtml, le suivi de la valeur est activé: chaque émission de l'observable valueChanges de l'abstractControl 
     * déclenche le traitement d'un KfEvenenment valeurChange.
     * Aprés initialiseHtml, est indéfini si le suivi de la valeur n'a jamais été activé, est vrai si le suivi de la valeur est actif
     * et est faux si le suivi de la valeur est suspendu
     */
    private pSuitLaValeur: boolean;
    private pSubscriptionSuitLaValeur: Subscription;

    private pSuitLeFocus: boolean;

    // ATTRIBUTS HTML
    private attributs: { nom: string, valeur: string }[];

    /**
     * title de l'element html
     */
    private pTitleHtml: string;

    private pOutput: EventEmitter<KfEvenement>;

    constructor(composant?: KfComposant) {
        this.composant = composant;
    }

    get parent(): KfComposantGereHtml {
        if (this.composant) {
            if (this.composant.parent) {
                return this.composant.parent.gereHtml;
            } else {
                if (this.composant.listeParent) {
                    return this.composant.listeParent.gereHtml;
                }
            }
        }
        return this.pParent;
    }
    set parent(parent: KfComposantGereHtml) {
        if (!this.composant) {
            this.pParent = parent;
        }
    }

    // DEFINITION
    /**
     * ajoute un évènement à écouter
     */
    ajouteEvenementASuivre(typeDHtmlEvent: KfTypeDHTMLEvents) {
        if (!this.evenementsADéclencher) {
            this.evenementsADéclencher = [];
        }
        if (!this.evenementsADéclencher.find(t => t === typeDHtmlEvent)) {
            this.evenementsADéclencher.push(typeDHtmlEvent);
        }
    }
    get déclencheClick(): boolean {
        return !!this.evenementsADéclencher && !!this.evenementsADéclencher.find(t => t === KfTypeDHTMLEvents.click);
    }
    get doitDéclencherFocusEtBlur(): boolean {
        return this.pSuitLeFocus || !!(this.composant && this.composant.gereTabIndexParent);
    }

    get estFocusable(): boolean {
        return this.doitDéclencherFocusEtBlur || KfDocumentContexte.suitLeFocus || (
            KfDocumentContexte.suitLeFocusFormEtClic && (
                this.déclencheClick || (
                    this.composant && (
                        this.composant.estFormulaire || this.composant.estEntree || this.composant.type === KfTypeDeComposant.radio
                    )
                )
            )
        );
    }

    // INITIALISATION DES HTMLELEMENTS
    ajouteEnfant(enfant: KfComposantGereHtml) {
        if (!this.enfants) {
            this.enfants = [];
        }
        this.enfants.push(enfant);
    }

    /**
     * S'il n'y a pas de composant ou si le composant n'a pas de valeur, est sans effet.
     * Si appelé avant initialiseHtml, le suivi de la valeur est activé: chaque émission de l'observable valueChanges de l'abstractControl 
     * déclenche le traitement d'un KfEvenenment valeurChange.
     * Aprés initialiseHtml, est indéfini si le suivi de la valeur n'a jamais été activé, est vrai si le suivi de la valeur est actif
     * et est faux si le suivi de la valeur est suspendu.
     */
     suitLaValeur() {
        this.pSuitLaValeur = true;
    }

    suitLeStatut() {
        this.pSuitLeStatut = true;
    }

    actionSansSuiviValeur(action: () => void): () => void {
        if (this.pSuitLaValeur !== true) {
            return action;
        }
        return () => {
            let suiviStatutDéjàSuspendu: boolean;
            let suiviValeurDéjàSuspendu: boolean;
            if (this.pSubscriptionSuitLaValeur) {
                this.pSubscriptionSuitLaValeur.unsubscribe();
                this.pSubscriptionSuitLaValeur = undefined;
            } else {
                suiviValeurDéjàSuspendu = true;
                if (this.pSubscriptionSuitLeStatut) {
                    this.pSubscriptionSuitLeStatut.unsubscribe();
                    this.pSubscriptionSuitLeStatut = undefined;
                } else {
                    suiviStatutDéjàSuspendu = true;
                }
            }
            action();
            if (!suiviValeurDéjàSuspendu) {
                this.souscritSuitLaValeur();
                if (!suiviStatutDéjàSuspendu) {
                    this.souscritSuitLeStatut();
                }
            }
        }
    }

    actionSansSuiviDuStatut(action: () => void) {
        if (this.pSuitLeStatut !== true) {
            action();
            return;
        }
        let suiviStatutDéjàSuspendu: boolean;
        if (this.pSubscriptionSuitLeStatut) {
            this.pSubscriptionSuitLeStatut.unsubscribe();
            this.pSubscriptionSuitLeStatut = undefined;
        } else {
            suiviStatutDéjàSuspendu = true;
        }
        action();
        if (!suiviStatutDéjàSuspendu) {
            this.souscritSuitLeStatut();
        }
    }

    souscritSuitLaValeur() {
        this.pSubscriptionSuitLaValeur = this.composant.abstractControl.valueChanges.subscribe(
            valeur => {
                this.traite(new KfEvenement(this.composant, KfTypeDEvenement.valeurChange, valeur));
            }
        )
    }

    souscritSuitLeStatut() {
        this.pSubscriptionSuitLeStatut = this.composant.abstractControl.statusChanges.subscribe(
            statut => {
                this.traite(new KfEvenement(this.composant, KfTypeDEvenement.statutChange, statut));
            }
        )
    }
    /** permet de suspendre le suivi du statut et de la valeur */
    suspendSuitLeStatut: boolean;

    /**
     * Initialise les attributs, les évènements
     */
    initialiseHtml(output?: EventEmitter<KfEvenement>) {
        if (this.attributs) {
            this.attributs.forEach(a => {
                this.htmlElement.setAttribute(a.nom, a.valeur);
            });
        }
        if (this.pTitleHtml) {
            this.htmlElement.title = this.pTitleHtml;
        }
        /*
        if (this.composant.gereTabIndex) {
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.keydown);
        }
        if (this.composant.gereTabIndexParent) {
            this.composant.gereTabIndexParent.initialise();
        }
        */
        if (this.doitDéclencherFocusEtBlur) {
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.blur);
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.focus);
        }
        if (!this.parent) {
            this.pOutput = output;
        }
        if (this.evenementsADéclencher) {
            const composant = this.composant;
            this.evenementsADéclencher.forEach(
                htmlEventType =>
                    this.htmlElement['on' + htmlEventType] =
                    ((event: Event): any => {
                        const evenement = new KfEvenement(composant, htmlEventType, event);
                        event.stopPropagation();
                        this.traite(evenement);
                        if (evenement.statut === KfStatutDEvenement.fini) {
                            event.preventDefault();
                        }
                    }).bind(this)
            );
        }
        if (this.composant && this.composant.gereValeur) {
            if (this.pSuitLeStatut) {
                this.souscritSuitLeStatut();
            }
            if (this.pSuitLaValeur) {
                this.souscritSuitLaValeur();
            }
        }
    }

    // TABINDEX

    get tabIndex(): number {
        return this.htmlElement.tabIndex;
    }
    set tabIndex(tabIndex: number) {
        this.htmlElement.tabIndex = tabIndex;
    }

    // FOCUS
    prendLeFocus(): boolean {
        if (this.estFocusable) {
            if (this.htmlElement) {
                console.log('prendLeFocus', document.activeElement);
                this.htmlElement.focus();
            }
            return true;
        }
        return false;
    }

    get aLeFocus(): boolean {
        if (this.htmlElement) {
            return document.activeElement === this.htmlElement;
        }
        return false;
    }

    /**
     * Prépare le composant pour des événements soient émis quand son htmlElement prendra ou perdra le focus
     * Fixe les fonctions à appeler quand le htmlElement prend ou perd le focus
     * @param focusPris fonction à appeler quand le htmlElement prend le focus
     * @param focusPerdu fonction à appeler quand le htmlElement perd le focus
     */
    suitLeFocus(focusPris: () => void, focusPerdu: () => void) {
        this.pSuitLeFocus = true;
        this.ajouteTraiteur(KfTypeDEvenement.focus, focusPris);
        this.ajouteTraiteur(KfTypeDEvenement.blur, focusPerdu);
    }

    // TRAITEMENT
    /**
     * Ajoute une procédure de traitement.
     * On peut ajouter autant de traitements qu'on veut pour le même type d'évènements.
     * Si une procédure de traitement fixe le statut de l'événement à 'fini', les procédures de traitement
     * suivantes ne seront pas appelées et l'événément ne sera pas réémis par l'output du component
     * @param typeEvenement à traiter
     * @param traitement procédure qui traite ou non en fonction de son emetteur
     * @param info pour distinguer les traitements au déboguage
     */
    ajouteTraiteur(typeEvenement: KfTypeDEvenement, traitement: KfTraitementDEvenement, info?: any) {
        const t: KFTraiteurDEvenement = {
            type: typeEvenement,
            traitement,
            info
        };
        if (this.traiteurDEvenements) {
            this.traiteurDEvenements.push(t);
        } else {
            this.traiteurDEvenements = [t];
        }
    }
    /**
     * fixe la procédure de traitement
     * les traitements précédents de ce type d'évènement sont supprimés
     * @param typeEvenement à traiter
     * @param traitement procédure qui traite ou non en fonction de son emetteur
     * @param info pour distinguer les traitements au déboguage
     */
    supprimeTraiteurs(typeEvenement: KfTypeDEvenement) {
        if (this.traiteurDEvenements) {
            const traiteur = this.traiteurDEvenements.filter(t1 => t1.type !== typeEvenement);
            this.traiteurDEvenements = traiteur.length > 0 ? traiteur : undefined;
        }
    }
    /**
     * fixe la procédure de traitement
     * les traitements précédents de ce type d'évènement sont supprimés
     * @param typeEvenement à traiter
     * @param traitement procédure qui traite ou non en fonction de son emetteur
     * @param info pour distinguer les traitements au déboguage
     */
    fixeTraiteur(typeEvenement: KfTypeDEvenement, traitement?: KfTraitementDEvenement, info?: any) {
        this.supprimeTraiteurs(typeEvenement);
        this.ajouteTraiteur(typeEvenement, traitement, info);
    }

    /**
     *  à la sortie, evenement.fini est true si l'évènement a été traité
     */
    traite(evenement: KfEvenement) {
        if (/*evenement.type === KfTypeDEvenement.focusPerdu || evenement.type === KfTypeDEvenement.focusPris
            ||*/ evenement.type === KfTypeDEvenement.valeurChange) {
            console.log('traite ' + evenement.type, this.composant.nom, evenement.emetteur.nom);
        }
        if (this.traiteurDEvenements) {
            const traiteurs = this.traiteurDEvenements.filter(t => t.type === evenement.type);
            for (let index = 0; index < traiteurs.length && evenement.statut !== KfStatutDEvenement.fini; index++) {
                traiteurs[index].traitement(evenement);
            }
        }
        if (evenement.statut !== KfStatutDEvenement.fini) {
            if (this.parent) {
                this.parent.traite(evenement);
            } else {
                if (this.pOutput) {
                    evenement.emetteur = this.composant;
                    this.pOutput.emit(evenement);
                }
            }
        }
    }

    // ATTRIBUTS HTML
    fixeAttribut(nom: string, valeur?: string) {
        if (this.htmlElement) {
            this.htmlElement.setAttribute(nom, valeur);
            return;
        }
        if (!this.attributs) {
            this.attributs = [];
        }
        const index = this.attributs.findIndex(a => a.nom === nom);
        if (index === -1) {
            this.attributs.push({ nom, valeur });
        } else {
            this.attributs[index].valeur = valeur;
        }
    }
    supprimeAttribut(nom: string) {
        if (this.htmlElement) {
            this.htmlElement.removeAttribute(nom);
            return;
        }
        if (this.attributs) {
            const index = this.attributs.findIndex(a => a.nom === nom);
            if (index !== -1) {
                this.attributs.splice(index, 1);
            }
        }
    }
    /**
     * Valeur de l'attribut de l'htmlElement s'il existe ou du tableau des attributs initial
     * @param nom nom d'un attribut Html
     * @returns undefined si l'attribut n'existe pas, null si l'attribut existe et n'a pas de valeur
     */
    attribut(nom: string): string {
        if (this.htmlElement) {
            const attr = this.htmlElement.attributes.getNamedItem(nom);
            return attr ? attr.value : null;
        }
        if (this.attributs) {
            const attribut = this.attributs.find(a => a.nom === nom);
            return attribut ? attribut.valeur : null;
        }
        return undefined;
    }

    /**
     * title de l'element
     */
    get titleHtml(): string {
        return this.pTitleHtml;
    }
    set titleHtml(titleHtml: string) {
        this.pTitleHtml = titleHtml;
        if (this.htmlElement) {
            this.htmlElement.title = titleHtml;
        }
    }
}
