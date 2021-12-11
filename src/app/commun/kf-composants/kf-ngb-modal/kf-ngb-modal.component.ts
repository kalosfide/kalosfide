import { Component, ElementRef, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KfNgbModal } from './kf-ngb-modal';
import { KfEvenement, KfTypeDEvenement } from '../kf-partages/kf-evenements';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-kf-ngb-modal',
    templateUrl: './kf-ngb-modal.component.html',
    styleUrls: ['../kf-composants.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KfNgbModalComponent {
    @Input() modal: KfNgbModal;
    @ViewChild('titreElement', { static: false }) titreElementRef: ElementRef;
    @ViewChild('corpsElement', { static: false }) corpsElementRef: ElementRef;
    @ViewChild('piedElement', { static: false }) piedElementRef: ElementRef;

    divDuClic: HTMLDivElement;
    divDéplaçable: HTMLDivElement;

    constructor(
        public activeModal: NgbActiveModal,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    traiteClic(evenement: KfEvenement) {
        if (evenement.type === KfTypeDEvenement.click) {
            this.activeModal.close(evenement.emetteur.nom);
        }
    }

    prépareDéplacement() {
        let htmlElement: HTMLElement;
        if (this.modal.enTete) {
            htmlElement = this.titreElementRef.nativeElement;
            this.divDuClic = htmlElement as HTMLDivElement;
            if (this.modal.curseurDéplacement) {
                this.divDuClic.style.cursor = 'move';
            }
        } else {
            if (this.modal.corps) {
                htmlElement = this.corpsElementRef.nativeElement;
            } else {
                htmlElement = this.piedElementRef.nativeElement;
            }
        }
        htmlElement = htmlElement.parentElement; // app-kf-ngb-modal
        htmlElement = htmlElement.parentElement; // modal-content
        htmlElement = htmlElement.parentElement; // modal-window
        this.divDéplaçable = htmlElement as HTMLDivElement;
        if (!this.divDuClic) {
            this.divDuClic = this.divDéplaçable;
        }

        let xSouris: number, ySouris: number;
        let gauche: number, droite: number;
        let haut: number, bas: number;
        gauche = this.divDéplaçable.offsetLeft;
        haut = this.divDéplaçable.offsetTop;
        droite = gauche;
        bas = haut;
        this.divDéplaçable.style.position = 'absolute';
        this.divDéplaçable.style.left = `${gauche}px`;
        this.divDéplaçable.style.top = `${haut}px`;
        const commenceDéplacement = (event: MouseEvent) => {
            event.preventDefault();
            xSouris = event.clientX;
            ySouris = event.clientY;
            this.document.onmouseup = termineDéplacement;
            this.document.onmousemove = déplacement;
        }
        const déplacement = (event: MouseEvent) => {
            event.preventDefault();
            let deltaX = event.clientX - xSouris;
            let deltaY = event.clientY - ySouris
            xSouris = event.clientX;
            ySouris = event.clientY;
            if (gauche < -deltaX) {
                deltaX = -gauche;
            }
            if (droite < deltaX) {
                deltaX = droite
            }
            gauche = gauche + deltaX;
            if (haut < -deltaY) {
                deltaY = -haut;
            }
            haut = haut + deltaY;
            console.log(deltaX, deltaY, this.divDéplaçable.offsetLeft, this.divDéplaçable.offsetTop);
            this.divDéplaçable.style.left = `${gauche}px`;
            this.divDéplaçable.style.top = `${haut}px`;
        }
        const termineDéplacement = () => {
            this.document.onmouseup = null;
            this.document.onmousemove = null;
        }
        this.divDuClic.onmousedown = commenceDéplacement;
    }


}
