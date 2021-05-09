import { OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { ApiRequêteService } from '../api/api-requete.service';
import { ApiResult401Unauthorized } from '../api/api-results/api-result-401-unauthorized';
import { ApiResultErreur, ApiResultErreurSpéciale } from '../api/api-results/api-result-erreur';
import { AppPages } from '../app-pages';
import { AppSiteRoutes, AppSitePages } from '../app-site/app-site-pages';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { PageDef } from '../commun/page-def';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { IBoutonDef } from '../disposition/fabrique/fabrique-bouton';
import { IUrlDef } from '../disposition/fabrique/fabrique-url';
import { ModalComponent, IModalComponentDef } from '../disposition/modal/modal.component';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class ModalErreurComponent extends ModalComponent implements OnInit, OnDestroy {
    pageDef: PageDef = AppPages.apiErreurModal;
    apiErreur: ApiResultErreur;

    constructor(
        protected route: ActivatedRoute,
        private apiService: ApiRequêteService
        ) {
        super(route, apiService);
    }

    créeDef(data: Data): IModalComponentDef {
        const apiErreur = this.apiService.routeur.apiErreur
            ? this.apiService.routeur.apiErreur
            : new ApiResultErreurSpéciale(0, 'Erreur inconnue', `Une erreur s'est produite.`);
        const corps = new KfGroupe('');
        apiErreur.messages.forEach(message => {
            const étiquette = Fabrique.ajouteEtiquetteP();
            Fabrique.ajouteTexte(étiquette, message);
            corps.ajoute(étiquette);
        });
        const boutonDefs: IBoutonDef[] = [];
        const urlPrécédente = this.service.navigation.urlPrécédente();
        const defFermer: IBoutonDef = {
            nom: 'fermer',
            contenu: { texte: 'Fermer', },
        };
        let urlSiPasAction: string | IUrlDef;
        if (apiErreur.statusCode === ApiResult401Unauthorized.code) {
            const apiErreur401 = apiErreur as ApiResult401Unauthorized;
            urlSiPasAction = AppSiteRoutes.url([AppSitePages.accueil.urlSegment]);
            const defRedirige: IBoutonDef = {
                nom: 'redirige',
                contenu: { texte: apiErreur401.lienConnection },
                action: () => {
                    this.service.routeur.navigate([apiErreur401.urlConnection]);
                }
            };
            boutonDefs.push(defFermer, defRedirige);
        } else {
            urlSiPasAction = urlPrécédente;
            boutonDefs.push(defFermer);
        }
        return {
            titre: apiErreur.titre,
            corps,
            boutonDefs,
            urlSiPasAction
        };
    }
}
