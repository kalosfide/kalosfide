import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageMessageComponent } from '../disposition/page-message/page-message.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageDef } from 'src/app/commun/page-def';
import { AppPages } from 'src/app/app-pages';

@Component({
    templateUrl: '../disposition/page-message/page-message.component.html',
    styleUrls: ['../commun/commun.scss']
})
export class PageErreurComponent extends PageMessageComponent implements OnInit, OnDestroy {
    pageDef: PageDef = AppPages.apiErreur;

    messages: string[];

    subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.créeTitrePage();
        this.subscriptions.push(this.route.paramMap.subscribe((paramMap: ParamMap) => {
            this.messages = [
                'Erreur ' + paramMap.get('statusCode'),
                paramMap.get('message')
            ];
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
