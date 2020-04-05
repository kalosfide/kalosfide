import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-peut-quitter',
    templateUrl: './peut-quitter.component.html',
    styleUrls: ['../commun.scss']
})
export class PeutQuitterComponent {
    @Input() titre: string;
    @Input() message: string;

    constructor(
        public modal: NgbActiveModal
    ) {
        this.titre = 'Constructor';
    }

}
