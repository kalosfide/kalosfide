import { Injectable } from '@angular/core';
import { Observable, fromEvent, Subject } from 'rxjs';
import { KfDialogueDef } from './kf-dialogue-def';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { map } from 'rxjs/operators';

const DIALOGUE_DANS_DIV = true;

/**
 * Async modal dialog service
 */
@Injectable()
export class KfDialogueService {

    composants: KfComposant[];
    composantAvecForm: KfGroupe;

    // les éléments HTML sont liés par le DialogueComponent lors du AfterViewInit

    private dialogElement: any;
    private divFond: HTMLDivElement;
    private divBarreDeTitre: HTMLDivElement;
    private pTitre: HTMLParagraphElement;
    private spanFermer: HTMLSpanElement;
    private divMessage: HTMLDivElement;
    private buttonOk: HTMLButtonElement;
    private buttonAnnuler: HTMLButtonElement;
    private confirmationObs: Observable<any>;

    private confirmeSubject: Subject<boolean>;

    constructor(
    ) {
        this.confirmeSubject = new Subject<boolean>();
        this.confirmationObs = this.confirmeSubject.asObservable();
    }

    get dansDivElement(): boolean {
        return DIALOGUE_DANS_DIV;
    }
    get dansDialogElement(): boolean {
        return !DIALOGUE_DANS_DIV;
    }

    fixeHtmlElements(dialogElement: any,
                     divBarreDeTitre: HTMLDivElement,
                     pTitre: HTMLParagraphElement,
                     spanFermer: HTMLSpanElement,
                     divMessage: HTMLDivElement,
                     buttonOk: HTMLButtonElement,
                     buttonAnnuler: HTMLButtonElement,
    ) {
        if (DIALOGUE_DANS_DIV) {
            this.divFond = dialogElement;
        } else {
            this.dialogElement = dialogElement;
        }
        this.divBarreDeTitre = divBarreDeTitre;
        this.pTitre = pTitre;
        this.spanFermer = spanFermer;
        this.divMessage = divMessage;
        this.buttonOk = buttonOk;
        this.buttonAnnuler = buttonAnnuler;
    }

    clic(event: Event) {
        const confirmation = event.target === this.buttonOk;
        this.fermeDialogue();
        this.confirmeSubject.next(confirmation);
    }

    ouvreDialogue() {
        if (DIALOGUE_DANS_DIV) {
            this.divFond.setAttribute('ouvert', '');
        } else {
            this.dialogElement.showModal();
        }
    }

    fermeDialogue() {
        if (DIALOGUE_DANS_DIV) {
            this.divFond.removeAttribute('ouvert');
        } else {
            this.dialogElement.close();
        }
    }

    get estOuvert(): boolean {
        return DIALOGUE_DANS_DIV ? !!this.divFond.getAttribute('ouvert') : this.dialogElement.open;
    }

    get okInactif(): boolean {
        if (this.composantAvecForm) {
            const form = this.composantAvecForm.formGroup;
            if (form) {
                return form.pristine || !form.valid;
            }
        }
        return false;
    }

    /**
     * Demande à l'utilisateur de répondre oui ou non à une question
     * @param titre si défini, fenêtre avec barre de titre et fermeur (x)
     * @param message si défini, précise la question
     * @param actionSiConfirmé si définie, la fonction est éxécutée avant de retourner l'observable
     */
    edite(composants: KfComposant[], dialogueDef: KfDialogueDef): Observable<boolean> {
        if (!this.pTitre) {
            throw new Error(
                'Pour pouvoir utiliser KfDialogueService, le template du root component doit contenir <app-kf-dialogue></app-kf-dialogue>');
        }
        this.composants = composants;
        if (dialogueDef.titre) {
            this.pTitre.textContent = dialogueDef.titre;
            this.divBarreDeTitre.style.setProperty('display', 'block');
        } else {
            this.divBarreDeTitre.style.setProperty('display', 'none');
        }
        this.buttonOk.textContent = dialogueDef.texteOk || 'Ok';
        this.buttonAnnuler.textContent = dialogueDef.texteAnnuler || 'Annuler';
        this.ouvreDialogue();
        return this.confirmationObs;
    }

}
