import { Component, Input, OnInit } from '@angular/core';
import { NavBar } from './navbar';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['../../commun/commun.scss']
})
export class NavBarComponent implements OnInit {
    @Input() navBar: NavBar;

    constructor() { }

    ngOnInit() {
    }

}
