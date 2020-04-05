import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KfDiv } from './kf-div';
import { KfEvenement } from '../kf-evenements';

@Component({
    selector: 'app-kf-div',
    templateUrl: './kf-div.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfDivComponent implements OnInit {
    @Input() div: KfDiv;
    @Output() output: EventEmitter<KfEvenement> = new EventEmitter();

    ngOnInit() {
    }

    transmet(evenement: KfEvenement) {
        this.output.emit(evenement);
    }

}
