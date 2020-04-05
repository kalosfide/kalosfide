import { NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[appInactif]'
})
export class KfInactifDirective {

    @Input() set disableControl(condition: boolean) {
        const action = condition ? 'disable' : 'enable';
        this.ngControl.control[action]();
    }

    constructor(private ngControl: NgControl) {
    }

}
