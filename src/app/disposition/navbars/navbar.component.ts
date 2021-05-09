import { Component, Input, OnInit } from '@angular/core';
import { NavBar } from './navbar';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
})
export class NavBarComponent implements OnInit {
    @Input() navBar: NavBar;

    constructor() { }

    ngOnInit() {
    }

}
