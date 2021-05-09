import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientALESComponent } from './client-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurClientPages } from './client-pages';
import { ClientService } from 'src/app/modeles/client/client.service';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientEditeComponent extends ClientALESComponent {

    pageDef: PageDef = FournisseurClientPages.edite;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = this.actionEdite();
        this.action.actionSiOk = () => this.service.quandEdite(this.client);
    }

}
