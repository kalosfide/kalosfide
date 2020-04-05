import { NavDef } from './nav-def';
import { Subscription } from 'rxjs';

export abstract class PageNavComponent {
    abstract navDefs: NavDef[];

    subscriptions: Subscription[] = [];

    constructor(
    ) {}

}
