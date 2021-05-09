import { ComptePages } from '../compte-pages';
import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { ConfirmeEmailModel } from './confirme-email.model';
import { CompteService } from '../compte.service';
import { Observable } from 'rxjs';
import { ConfirmeEmailBaseComponent } from './confirme-email-base.component';
import { DefTexte } from 'src/app/disposition/fabrique/fabrique-texte';
import { ApiResult } from 'src/app/api/api-results/api-result';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ConfirmeChangeEmailComponent extends ConfirmeEmailBaseComponent implements OnInit {

    pageDef: PageDef = ComptePages.confirmeChangeEmail;

    titreSucces = 'Le changement de votre adresse email a été confirmée.';
    titreErreur = 'La confirmation du changement de votre adresse email a échoué.';
    détailSucces(confirmeEmail: ConfirmeEmailModel) {
        return `Vous devrez utiliser votre nouvelle adresse ${confirmeEmail.email} `
            + `lors de votre prochaine connection`;
    }

    defAvant(confirmeEmail: ConfirmeEmailModel): DefTexte[] {
        return [
            `Le changement de votre adresse email en ${confirmeEmail.email} est en cours de confirmation.`
        ];
    }

    demandeApi(confirmeEmail: ConfirmeEmailModel): Observable<ApiResult> {
        return this.service.confirmeChangeEmail(confirmeEmail);
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(route, service);
    }

}
