import {
    KfEvenement, KfTypeDEvenement,
    KfTraitementDEvenement, KFTraiteurDEvenement, KfTypeDHTMLEvents, KfStatutDEvenement
} from '../kf-partages/kf-evenements';
import { KfComposant } from './kf-composant';
import { KfDocumentContexte } from '../kf-constantes';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBouton, KfTypeDeComposant } from '../kf-composants-types';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

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
    /**
     * enfantsDeVue: { [key: string]: HTMLElement };
     *  après AfterViewInit, certains ViewChild de l'Angular component sont enregistrés
     *  en tant que champs de enfantsDeVue
     */
    enfantsDeVue: { [key: string]: HTMLElement };

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
     * si suitLeStatut, le component emet un KfEvenenment statutChange en réponse à un événement statusChanges de l'abstractControl
     */
    suitLeStatut: boolean;
    /** permet de suspendre le suivi du statut et de la valeur */
    suspendSuitLeStatut: boolean;

    /**
     * si suitLaValeur, le component emet un KfEvenenment valeurChange en réponse à un événement valueChanges de l'abstractControl
     */
    suitLaValeur: boolean;
    /** permet de suspendre le suivi du statut et de la valeur */
    suspendSuitLaValeur: boolean;

    suitLeFocus: boolean;
    private valeurAvantFocus: any;

    // ATTRIBUTS HTML
    private attributs: { nom: string, valeur: string }[];

    constructor(composant: KfComposant) {
        this.composant = composant;
    }

    /**
     * fixe les évènements concernant la valeur
     */
    prépareRacineV() {
        if (this.composant.type !== KfTypeDeComposant.groupe || !this.composant.estRacineV) {
            return;
        }
        const groupe = this.composant as KfGroupe;
        if (groupe.sauveQuandChange) {
            this.suitLaValeur = true;
            this.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                (e: KfEvenement) => {
                    this.suspendSuitLeStatut = true;
                    this.suspendSuitLaValeur = true;
                    groupe.gereValeur.depuisControl();
                    this.suspendSuitLeStatut = false;
                    this.suspendSuitLaValeur = false;
                    e.statut = KfStatutDEvenement.fini;
                }
            );
        } else {
            this.ajouteTraiteur(KfTypeDEvenement.retablit,
                (e: KfEvenement) => {
                    groupe.rétablitFormulaire();
                    e.statut = KfStatutDEvenement.fini;
                }
            );
            this.ajouteTraiteur(KfTypeDEvenement.soumet,
                (e: KfEvenement) => {
                    groupe.soumetFormulaire();
                    e.statut = KfStatutDEvenement.fini;
                }
            );
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
        return this.suitLeFocus || !!this.composant.gereTabIndexParent;
    }

    get estFocusable(): boolean {
        return this.doitDéclencherFocusEtBlur || KfDocumentContexte.suitLeFocus || (KfDocumentContexte.suitLeFocusFormEtClic
            && (this.composant.estFormulaire || this.composant.estEntree
                || this.composant.type === KfTypeDeComposant.radio
                || this.déclencheClick));
    }

    // INITIALISATION DES HTMLELEMENTS
    /**
     * Initialise les attributs, les évènements
     */
    initialiseHtml(output: EventEmitter<KfEvenement>) {
        if (this.attributs) {
            this.attributs.forEach(a => {
                this.htmlElement.setAttribute(a.nom, a.valeur);
            });
            this.attributs = undefined; // devenu inutile
        }
        if (this.composant.titleHtml) {
            this.htmlElement.title = this.composant.titleHtml;
        }
        if (this.composant.gereTabIndex) {
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.keydown);
        }
        if (this.composant.gereTabIndexParent) {
            this.composant.gereTabIndexParent.initialise();
        }
        if (this.doitDéclencherFocusEtBlur) {
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.blur);
            this.ajouteEvenementASuivre(KfTypeDHTMLEvents.focus);
        }
        if (this.evenementsADéclencher) {
            this.evenementsADéclencher.forEach(
                htmlEventType =>
                    this.htmlElement['on' + htmlEventType] =
                    (event: Event): any => {
                        const evenement = this.transformateur(htmlEventType)(event);
                        output.emit(evenement);
                        switch (evenement.statut) {
                            case KfStatutDEvenement.fini:
                                event.stopPropagation();
                                break;
                            default:
                                break;
                        }
                    }
            );
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
            this.htmlElement.focus();
            return true;
        }
        return false;
    }

    /**
     * Sauve la valeur du control quand il reçoit le focus
     * Quand le control perd le focus, si sa valeur a changé et si le formulaire parent est valide, déclenche une action async
     * Si l'action échoue, restaure la valeur d'avant la prise de focus.
     * @param quandChange retourne un observable qui emet faux si l'action a échoué
     */
    private traiteFocusChange(quandChange: () => Observable<boolean>): KfTraitementDEvenement {
        return ((evenement: KfEvenement) => {
            if (evenement.type === KfTypeDEvenement.focusPris) {
                this.valeurAvantFocus = this.composant.abstractControl.value;
                return;
            }
            if (evenement.type === KfTypeDEvenement.focusPerdu) {
                if (this.composant.abstractControl.valid) {
                    const valeur = this.composant.abstractControl.value;
                    if ('' + this.valeurAvantFocus !== '' + valeur) {
                        if (this.composant.formulaireParent.abstractControl.valid) {
                            const subscription = quandChange().subscribe(
                                ok => {
                                    subscription.unsubscribe();
                                    if (!ok) {
                                        this.composant.gereValeur.valeur = this.valeurAvantFocus;
                                    }
                                }
                            );
                        }
                    }
                } else {
                    this.composant.gereValeur.valeur = this.valeurAvantFocus;
                }
            }
        }).bind(this);
    }

    suitValeurEtFocus(quandChange: () => Observable<boolean>) {
        this.suitLeFocus = true;
        this.ajouteTraiteur(KfTypeDEvenement.focusPris, this.traiteFocusChange(quandChange));
        this.ajouteTraiteur(KfTypeDEvenement.focusPerdu, this.traiteFocusChange(quandChange));
    }

    // DECLENCHEURS
    transformateur(htmlEventType: KfTypeDHTMLEvents): (event: Event) => KfEvenement {
        switch (htmlEventType) {
            case KfTypeDHTMLEvents.blur:
                return this.transformeBlur;
            case KfTypeDHTMLEvents.click:
                return this.transformeClick;
            case KfTypeDHTMLEvents.focus:
                return this.transformeFocus;
            case KfTypeDHTMLEvents.keydown:
                return this.transformeKeyDown;
            default:
                return this.transforme;
        }
    }

    transforme = (event: Event): KfEvenement => {
        return new KfEvenement(this.composant, KfTypeDEvenement.html, event);
    }
    transformeClick = (): KfEvenement => {
        let type: KfTypeDEvenement;
        const typeDeBouton = (this.composant as KfBouton).typeDeBouton;
        switch (typeDeBouton) {
            case KfTypeDeBouton.annuler:
            case KfTypeDeBouton.retablir:
                type = KfTypeDEvenement.retablit;
                break;
            case KfTypeDeBouton.soumettre:
                type = KfTypeDEvenement.soumet;
                break;
            default:
                type = KfTypeDEvenement.clic;
                break;
        }
        return new KfEvenement(this.composant, type);
    }
    transformeKeyDown = (event: Event): KfEvenement => {
        const keyEvent = event as KeyboardEvent;
        if (this.déclencheClick) {
            // enter ou space déclenchent un clic
            if (!keyEvent.altKey && !keyEvent.ctrlKey && !keyEvent.shiftKey
                && (keyEvent.key === KfKeyboardKey.enter || keyEvent.key === KfKeyboardKey.space)) {
                return this.transformeClick();
            }
        }
        return new KfEvenement(this.composant, KfTypeDEvenement.toucheBaissee, event);
    }
    transformeBlur = (): KfEvenement => {
        KfDocumentContexte.quandPerdFocus(this.composant);
        return new KfEvenement(this.composant, KfTypeDEvenement.focusPerdu);
    }
    transformeFocus = (): KfEvenement => {
        KfDocumentContexte.quandPrendFocus(this.composant);
        return new KfEvenement(this.composant, KfTypeDEvenement.focusPris);
    }

    // TRAITEMENT
    /**
     * ajoute une procédure de traitement
     * on peut ajouter autant de traitements qu'on veut pour le même type d'évènements
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
        if (this.traiteurDEvenements) {
            const traiteurs = this.traiteurDEvenements.filter(t => t.type === evenement.type);
            for (const traiteur of traiteurs) {
                traiteur.traitement(evenement);
                if (evenement.statut !== KfStatutDEvenement.aTraiter) {
                    return true;
                }
            }
        }
    }

    // ATTRIBUTS HTML
    fixeAttribut(nom: string, valeur?: string) {
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
}
