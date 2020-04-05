import { Component, OnInit } from '@angular/core';
import { AppSite } from 'src/app/app-site/app-site';

@Component({
  selector: 'app-pied',
  templateUrl: './pied.component.html',
  styleUrls: ['../../commun/commun.scss']

})
export class PiedComponent implements OnInit {
    AppSite: any;

    constructor(
    ) {
        this.AppSite = AppSite;
    }

  ngOnInit() {
  }

}
