import { Component, HostListener, OnInit } from '@angular/core';
import { TraiteKeydownService } from './commun/traite-keydown/traite-keydown.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        console.log('keydown ')
        if (this.composantService.traiteToucheEnfoncée(event)) {
            event.preventDefault();
        }
    }

    dev = true;

    constructor(
        private composantService: TraiteKeydownService
    ) {
    }

    ngOnInit() {
        //        testCouleur();
        if (!this.dev) {
            window.addEventListener('beforeunload', () => {
                console.log('window.beforeunload', event);
                // Cancel the event as stated by the standard.
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = false;
            });
        }
    }
}
