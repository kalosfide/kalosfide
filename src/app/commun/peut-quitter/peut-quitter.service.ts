import { Injectable } from '@angular/core';
import { Observable, fromEvent, race, from, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PeutQuitterComponent } from './peut-quitter.component';
import { catchError, map } from 'rxjs/operators';

/**
 * Async modal dialog service
 */
@Injectable({ providedIn: 'root' })
export class PeutQuitterService {

    constructor(
        private modalService: NgbModal
    ) {
    }

    /**
     * Demande à l'utilisateur confirmer avant de quitter une page
     * @param titre titre de la page
     * @param message si défini, précise la question
     */
    confirme(titre: string, message?: string): Observable<boolean> {
        const peutQuitterRef = this.modalService.open(PeutQuitterComponent);
        const peutQuitter = peutQuitterRef.componentInstance as PeutQuitterComponent;
        peutQuitter.titre = titre;
        peutQuitter.message = message ? message : 'Si vous quittez cette page, les données saisies seront perdues.';
        return from(peutQuitterRef.result).pipe(
            map(result => true),
            catchError(err => of(false))
        );
    }

}
