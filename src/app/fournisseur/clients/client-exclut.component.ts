import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientALESComponent } from './client-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { FournisseurClientPages } from './client-pages';
import { ClientService } from 'src/app/modeles/client/client.service';
import { EtatClient } from 'src/app/modeles/client/etat-client';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class ClientExclutComponent extends ClientALESComponent {

    pageDef: PageDef = FournisseurClientPages.exclut;

    get titre(): string {
        return this.pageDef.titre;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super(route, service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = {
            nom: this.pageDef.urlSegment,
            texteSoumettre: 'Exclure le client',
            apiDemande: () => this.service.changeEtat(this.client, EtatClient.exclu),
            actionSiOk: (créé?: any) => this.service.quandEtatChange(this.client)
        };

        const messages: KfEtiquette[] = [];
        Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteEtiquetteP(messages);
        this.groupeBoutonsMessages = new GroupeBoutonsMessages('', { messages });
    }

    fixeGroupeBoutonsMessages = () => {
        if (this.client.avecCommandes) {
            this.groupeBoutonsMessages.alerte('warning');
            this._message(0).fixeTexte(
                `Exclure un client le fait passer à l'état 'inactif' pour une période de 30 jours `
                + `pendant laquelle il conserve le droit de consulter et télécharger ses documents et peut être réactivé.`
            );
            this._message(1).fixeTexte(
                `A l'issue de cette période, ses données seront conservées mais rendues anonymes et il passera à l'état exclu.`
            );
        } else {
            this.groupeBoutonsMessages.alerte('danger');
            this._message(0).fixeTexte(
                `Les données de ce client vont être supprimées. `,
            );
            this._message(1).fixeTexte(
                `Cette action ne pourra pas être annulée.`,
            );
        }

    }

}
