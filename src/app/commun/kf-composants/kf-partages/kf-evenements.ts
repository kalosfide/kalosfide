import { KfComposant } from '../kf-composant/kf-composant';
/**
 * les KfEvenements sont émis et transmis par les KfComposantComponents
 *
 * emetteur: KfComposant avec declencheur
 * declencheur: htmlElement ou abstractControl de l'emetteur
 */
/**
 *  les évènements du DOM ou des AbstractControl sont transmis aux Angular components des ascendants jusqu'à ce que l'un deux les traite
 *  si un évènement arrive jusqu'à la racine sans avoir été traité, il est réémis par la racine
 */

/**
 * clic
 *  emetteur: KfComposant enrobant un DOM element pouvant être cliqué
 *  emetteur(s) implémenté(s): KfBouton de type button
 *
 *  traiteur possible: le bouton lui-même ou n'importe lequel de ses ascendants
 */

/**
 * reset
 *  emetteur: KfBouton de type reset
 *
 *  traiteur possible: n'importe lequel des groupes ascendants du bouton
 *  traiteur par défaut: la racine du bouton si c'est un formulaire
 *
 *  traitement: reset du formGroup du traiteur avec sa valeur
 */

/**
 * submit
 *  emetteur: KfBouton de type submit
 *
 *  traiteur: le superGroupe du bouton si c'est un formulaire
 *
 *  traitement: sauvegarde de la value du formGroupe du traiteur dans sa valeur
 */

/**
 * statutChange
 *  déclencheur: évènement statusChanges de l'abstractControl d'un composant
 *
 *  emetteur: composant ayant un abstractControl dont la propriété suitStatutChange a la valeur true
 *
 *  traiteur: pas de traiteur interne aux KfComposants
 *            le message est destiné à un Angular component ayant pour enfant un KfComposant
 *
 *  traitement: pas de traitement
 */

/**
 * valeurChange
 *  déclencheur: évènement valueChanges de l'abstractControl d'un composant
 *
 *  emetteur: composant ayant un abstractControl dont la propriété suitValeurChange a la valeur true
 *
 *  traiteur: pas de traiteur sauf si l'emetteur est un superGroupe dont la propriété sauveQuandValeurChagne vaut true
 *
 *  traitement: pas de traitement sauf dans le cas cité où la value du formGroup est sauvegardée dans la valeur du composant
 */

/**
 * menuChange
 *  déclencheur: évènement clic du sélecteur d'un sous-menu
 *
 *  emetteur: le sous-menu dont le sélecteur a été cliqué dans son traitement du clic
 *
 * paramètres: l'item de menu du sous-menu
 *
 *  traiteurs: 1) le sous-menu parent de ce sous-menu
 *
 *  traitement: pas de traitement sauf dans le cas cité où la value du formGroup est sauvegardée dans la valeur du composant
 */

export enum KfTypeDEvenement {
    clic = 'clic',
    retablit = 'retablit',
    soumet = 'soumet',
    statutChange = 'statutChange',
    valeurChange = 'valeurChange',
    menuChange = 'menuChange',
    toucheBaissee = 'toucheBaissee',
    toucheLevee = 'toucheLevee',
    focusPris = 'focusPris',
    focusPerdu = 'focusPerdu',
    fichiersChoisis = 'fichiersChoisis',
    fichierCharge = 'fichierOuvert',
    fichierSauve = 'fichierSauve',
    html = 'html',
    patience = 'patience',
}

export enum KfStatutDEvenement {
    aTraiter = 'aTraiter',
    enCours = 'enCours',
    fini = 'fini',
}

export class KfEvenement {
    private _emetteurs: KfComposant[] = [];
    type: KfTypeDEvenement;
    parametres: any;
    private _statut: KfStatutDEvenement;

    constructor(emetteur: KfComposant, type: KfTypeDEvenement, parametres?: any) {
        this.type = type;
        this.ajouteEmetteur(emetteur);
        this.parametres = parametres;
        this.statut = KfStatutDEvenement.aTraiter;
    }

    private ajouteEmetteur(emetteur: KfComposant) {
        this._emetteurs.push(emetteur);
    }

    public get emetteurInitial(): KfComposant { return this._emetteurs[0]; }
    public get emetteur(): KfComposant { return this._emetteurs[this._emetteurs.length - 1]; }
    public set emetteur(emetteur: KfComposant) { this.ajouteEmetteur(emetteur); }

    public get statut(): KfStatutDEvenement { return this._statut; }
    public set statut(statut: KfStatutDEvenement) {
        this._statut = statut;
    }
}

export type KfTransformateurDEvenement = (event: Event) => KfEvenement;
export type KfCapteurDEvenement = (element: HTMLElement, event: Event) => any;

export type KfTraitementDEvenement = (evenement: KfEvenement) => void;

export interface KFTraiteurDEvenement {
    type: KfTypeDEvenement;
    traitement: KfTraitementDEvenement;
    info?: any;
}

/*
Enchassement des templates à traverser

<app-kf-groupe [composant]="groupe">
    *ngFor... <app-kf-composant [composant]="composant" (output)=>"quandOutput($event)">
        *ngIf...<app-kf-emetteur [composant]="emetteur" (output)=>"quandOutput($event)">
            <htmlElement (anEvent)="quandAnEvent($event)">

composantComponent et emetteurComponent ne sont pas le même objet
composantComponent.composant et emetteurComponent.composant sont le même objet composant

emetteurComponent.quandAnEvent($event): $event est un évènement système
    crée le kfevenement evenement,
    demande à composant de le traiter,
    si pas traité, emetteurComponent.output.emit(evenement)

composantComponent.quandOutput($event): $event est evenement
    composantComponent.output.emit(evenement)

groupeComponent.quandOutput($event): $event est evenement
*/

export enum KfTypeDHTMLEvents {
    abort = 'abort',
    activate = 'activate',
    beforeactivate = 'beforeactivate',
    beforecopy = 'beforecopy',
    beforecut = 'beforecut',
    beforedeactivate = 'beforedeactivate',
    beforepaste = 'beforepaste',
    blur = 'blur',
    canplay = 'canplay',
    canplaythrough = 'canplaythrough',
    change = 'change',
    click = 'click',
    contextmenu = 'contextmenu',
    copy = 'copy',
    cuechange = 'cuechange',
    cut = 'cut',
    dblclick = 'dblclick',
    deactivate = 'deactivate',
    drag = 'drag',
    dragend = 'dragend',
    dragenter = 'dragenter',
    dragleave = 'dragleave',
    dragover = 'dragover',
    dragstart = 'dragstart',
    drop = 'drop',
    durationchange = 'durationchange',
    emptied = 'emptied',
    ended = 'ended',
    error = 'error',
    focus = 'focus',
    input = 'input',
    invalid = 'invalid',
    keydown = 'keydown',
    keypress = 'keypress',
    keyup = 'keyup',
    load = 'load',
    loadeddata = 'loadeddata',
    loadedmetadata = 'loadedmetadata',
    loadstart = 'loadstart',
    mousedown = 'mousedown',
    mouseenter = 'mouseenter',
    mouseleave = 'mouseleave',
    mousemove = 'mousemove',
    mouseout = 'mouseout',
    mouseover = 'mouseover',
    mouseup = 'mouseup',
    mousewheel = 'mousewheel',
    mscontentzoom = 'mscontentzoom',
    msmanipulationstatechanged = 'msmanipulationstatechanged',
    paste = 'paste',
    pause = 'pause',
    play = 'play',
    playing = 'playing',
    progress = 'progress',
    ratechange = 'ratechange',
    reset = 'reset',
    scroll = 'scroll',
    seeked = 'seeked',
    seeking = 'seeking',
    select = 'select',
    selectstart = 'selectstart',
    stalled = 'stalled',
    submit = 'submit',
    suspend = 'suspend',
    timeupdate = 'timeupdate',
    volumechange = 'volumechange',
    waiting = 'waiting',
}

export interface KFTraiteHTMLEvents {
    abort?: (this: HTMLElement, ev: UIEvent) => any;
    activate?: (this: HTMLElement, ev: UIEvent) => any;
    beforeactivate?: (this: HTMLElement, ev: UIEvent) => any;
    beforecopy?: (this: HTMLElement, ev: ClipboardEvent) => any;
    beforecut?: (this: HTMLElement, ev: ClipboardEvent) => any;
    beforedeactivate?: (this: HTMLElement, ev: UIEvent) => any;
    beforepaste?: (this: HTMLElement, ev: ClipboardEvent) => any;
    blur?: (this: HTMLElement, ev: FocusEvent) => any;
    canplay?: (this: HTMLElement, ev: Event) => any;
    canplaythrough?: (this: HTMLElement, ev: Event) => any;
    change?: (this: HTMLElement, ev: Event) => any;
    click?: (this: HTMLElement, ev: MouseEvent) => any;
    contextmenu?: (this: HTMLElement, ev: PointerEvent) => any;
    copy?: (this: HTMLElement, ev: ClipboardEvent) => any;
    cuechange?: (this: HTMLElement, ev: Event) => any;
    cut?: (this: HTMLElement, ev: ClipboardEvent) => any;
    dblclick?: (this: HTMLElement, ev: MouseEvent) => any;
    deactivate?: (this: HTMLElement, ev: UIEvent) => any;
    drag?: (this: HTMLElement, ev: DragEvent) => any;
    dragend?: (this: HTMLElement, ev: DragEvent) => any;
    dragenter?: (this: HTMLElement, ev: DragEvent) => any;
    dragleave?: (this: HTMLElement, ev: DragEvent) => any;
    dragover?: (this: HTMLElement, ev: DragEvent) => any;
    dragstart?: (this: HTMLElement, ev: DragEvent) => any;
    drop?: (this: HTMLElement, ev: DragEvent) => any;
    durationchange?: (this: HTMLElement, ev: Event) => any;
    emptied?: (this: HTMLElement, ev: Event) => any;
    ended?: (this: HTMLElement, ev: MediaStreamErrorEvent) => any;
    error?: (this: HTMLElement, ev: ErrorEvent) => any;
    focus?: (this: HTMLElement, ev: FocusEvent) => any;
    input?: (this: HTMLElement, ev: Event) => any;
    invalid?: (this: HTMLElement, ev: Event) => any;
    keydown?: (this: HTMLElement, ev: KeyboardEvent) => any;
    keypress?: (this: HTMLElement, ev: KeyboardEvent) => any;
    keyup?: (this: HTMLElement, ev: KeyboardEvent) => any;
    load?: (this: HTMLElement, ev: Event) => any;
    loadeddata?: (this: HTMLElement, ev: Event) => any;
    loadedmetadata?: (this: HTMLElement, ev: Event) => any;
    loadstart?: (this: HTMLElement, ev: Event) => any;
    mousedown?: (this: HTMLElement, ev: MouseEvent) => any;
    mouseenter?: (this: HTMLElement, ev: MouseEvent) => any;
    mouseleave?: (this: HTMLElement, ev: MouseEvent) => any;
    mousemove?: (this: HTMLElement, ev: MouseEvent) => any;
    mouseout?: (this: HTMLElement, ev: MouseEvent) => any;
    mouseover?: (this: HTMLElement, ev: MouseEvent) => any;
    mouseup?: (this: HTMLElement, ev: MouseEvent) => any;
    mousewheel?: (this: HTMLElement, ev: WheelEvent) => any;
    mscontentzoom?: (this: HTMLElement, ev: UIEvent) => any;
//    msmanipulationstatechanged?: (this: HTMLElement, ev: MSManipulationEvent) => any;
    paste?: (this: HTMLElement, ev: ClipboardEvent) => any;
    pause?: (this: HTMLElement, ev: Event) => any;
    play?: (this: HTMLElement, ev: Event) => any;
    playing?: (this: HTMLElement, ev: Event) => any;
    progress?: (this: HTMLElement, ev: ProgressEvent) => any;
    ratechange?: (this: HTMLElement, ev: Event) => any;
    reset?: (this: HTMLElement, ev: Event) => any;
}


