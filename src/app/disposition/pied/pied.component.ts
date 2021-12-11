import { Component, OnInit } from '@angular/core';
import { AppSite } from 'src/app/app-site/app-site';

@Component({
    selector: 'app-pied',
    templateUrl: './pied.component.html',

})
export class PiedComponent {
    AppSite: any;

    constructor(
    ) {
        this.AppSite = AppSite;
    }
}
