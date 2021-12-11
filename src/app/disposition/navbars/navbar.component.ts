import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavBar } from './navbar';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class NavBarComponent implements OnInit {
    @Input() navBar: NavBar;

    constructor() { }

    ngOnInit() {
    }

}
