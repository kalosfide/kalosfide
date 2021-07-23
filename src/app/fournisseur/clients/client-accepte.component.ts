import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientALESComponent } from './client-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurClientPages, FournisseurClientRoutes } from './client-pages';
import { ClientService } from 'src/app/modeles/client/client.service';
import { Site } from 'src/app/modeles/site/site';
import { EtatClient } from 'src/app/modeles/client/etat-client';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientAccepteComponent extends ClientALESComponent {

    pageDef: PageDef = FournisseurClientPages.accepte;

    get titre(): string {
        return this.pageDef.titre;
    }

    site: Site;

    dataPages = FournisseurClientPages;
    dataRoutes = FournisseurClientRoutes;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = {
            nom: this.pageDef.urlSegment,
            texteSoumettre: 'Accepter le client',
            apiDemande: () => this.service.active(this.client),
            actionSiOk: (créé?: any) => {
                this.service.quandActivé(this.client);
            }
        };

        const messages: KfEtiquette[] = [];
        Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteEtiquetteP(messages);
        this.groupeBoutonsMessages = new GroupeBoutonsMessages('', { messages });
    }

    fixeGroupeBoutonsMessages = () => {
        this.groupeBoutonsMessages.alerte('info');
        if (this.client.etat === EtatClient.nouveau) {
            this._message(0).fixeTexte(
                `Accepter un nouveau client le fait passer à l'état 'actif'. `,
            );
            this._message(1).fixeTexte(
                'Les clients nouveaux et actifs ont le droit de commander et de consulter et télécharger les documents. '
            );
        } else {
            this._message(0).fixeTexte(
                `Activer un client en attente d'ferméion le fait passer à l'état 'actif'. `,
            );
            this._message(1).fixeTexte(
                `La procédure d'ferméion est annulée.`
            );
        }

    }
}
