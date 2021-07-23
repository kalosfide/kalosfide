import { ComptePages } from '../compte-pages';
import { Component, OnInit } from '@angular/core';
import { PageDef } from 'src/app/commun/page-def';
import { ActivatedRoute } from '@angular/router';
import { ConfirmeEmailModel } from './confirme-email.model';
import { CompteService } from '../compte.service';
import { Observable } from 'rxjs';
import { ConfirmeEmailBaseComponent } from './confirme-email-base.component';
import { KfstringDef } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-textes';
import { ApiResult } from 'src/app/api/api-results/api-result';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ConfirmeEmailComponent extends ConfirmeEmailBaseComponent implements OnInit {

    pageDef: PageDef = ComptePages.confirmeEmail;

    titreSucces = 'Votre adresse email a été confirmée.';
    titreErreur = 'La confirmation de votre adresse email a échoué.';
    détailSucces(confirmeEmail: ConfirmeEmailModel) {
        return `Vous devrez utiliser votre adresse ${confirmeEmail.email} pour vous connecter`;
    }

    defAvant(confirmeEmail: ConfirmeEmailModel): KfstringDef[] {
        return [
            `Votre adresse email ${confirmeEmail.email} est en cours de confirmation.`
        ];
    }

    demandeApi(confirmeEmail: ConfirmeEmailModel): Observable<ApiResult> {
        return this.service.confirmeEmail(confirmeEmail);
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(route, service);
    }

}
