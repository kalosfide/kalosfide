import { Component, OnInit } from '@angular/core';
import { AppSite } from 'src/app/app-site/app-site';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({
    selector: 'app-pied',
    templateUrl: './pied.component.html',

})
export class PiedComponent implements OnInit {
    AppSite: any;

    bidon: KfEtiquette;

    constructor(
    ) {
        this.AppSite = AppSite;
    }

    ngOnInit() {
        this.bidon = new KfEtiquette('', 'Test toggle');
    }
    

    test() {
        console.log('check tested');
    }
}
