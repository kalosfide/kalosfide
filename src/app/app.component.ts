import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    dev = true;

    constructor(
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
