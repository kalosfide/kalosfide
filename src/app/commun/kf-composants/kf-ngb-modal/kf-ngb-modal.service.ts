import { Injectable } from '@angular/core';
import { Observable, fromEvent, race, from, of } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { KfNgbModalComponent } from './kf-ngb-modal.component';
import { catchError, map } from 'rxjs/operators';
import { KfNgbModal } from './kf-ngb-modal';

/**
 * Async modal dialog service
 */
@Injectable({ providedIn: 'root' })
export class KfNgbModalService {

    constructor(
        private modalService: NgbModal
    ) {
    }

    confirme(modal: KfNgbModal): Observable<boolean> {
        const modalComponentRef = this.modalService.open(KfNgbModalComponent, modal.options);
        const modalComponent = modalComponentRef.componentInstance as KfNgbModalComponent;
        modalComponent.modal = modal;
        return from(modalComponentRef.result).pipe(
            map(result => {
                const ok = result === modal.boutonOk.nom;
                return ok;
            }),
            catchError(err => of(false))
        );
    }

    résultat(modal: KfNgbModal): Observable<boolean | string> {
        const modalComponentRef = this.modalService.open(KfNgbModalComponent, modal.options);
        const modalComponent = modalComponentRef.componentInstance as KfNgbModalComponent;
        modalComponent.modal = modal;
        return from(modalComponentRef.result).pipe(
            map(result => result),
            catchError(err => {
                const result: boolean | string =
                    err === ModalDismissReasons.ESC || err === ModalDismissReasons.BACKDROP_CLICK ? false : '' + err;
                return of(result);
            })
        );
    }

    fermeTout() {
        this.modalService.dismissAll();
    }

}
