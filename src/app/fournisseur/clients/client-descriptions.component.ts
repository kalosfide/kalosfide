import { Component, OnInit } from '@angular/core';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeComposant } from '../../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../../disposition/page-base/page-base.component';
import { KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { ActivatedRoute } from '@angular/router';
import { KfContenuPhraséDefs } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfDescription } from 'src/app/commun/kf-composants/kf-description/kf-description';
import { KfDescriptions } from 'src/app/commun/kf-composants/kf-description/kf-descriptions';
import { ClientService } from 'src/app/modeles/client/client.service';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';

@Component({
    template: ''
})
export abstract class ClientDescriptionsComponent extends PageBaseComponent implements OnInit {

    protected descriptions: KfDescriptions;

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientService,
    ) {
        super();
    }

    protected ajouteDescription(titre: string, ...defs: (KfEtiquette | KfContenuPhraséDefs)[]): KfDescription {
        const description = this.descriptions.ajouteDescription();
        description.créeDiv();
        description.ajouteTitre(titre);
        let étiquette: KfEtiquette;
        const groupe = new KfGroupe('');
        defs.forEach(def => {
            if ((def as KfComposant).type === KfTypeDeComposant.etiquette) {
                groupe.ajoute(def as KfEtiquette);
            } else {
                étiquette = new KfEtiquette('');
                étiquette.fixeContenus(def as KfContenuPhraséDefs);
                groupe.ajoute(étiquette);
            }
        });
        description.ajouteDétail(groupe);
        return description;
    }

    protected abstract ajouteDescriptions(): void;

    ngOnInit() {
        this.descriptions = new KfDescriptions(this.pageDef.path);
        this.ajouteDescriptions();
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(this.descriptions);
        this.subscriptions.push(this.route.fragment.subscribe(fragment => {
            const description = this.descriptions.descriptions.find(d => d.nom === fragment);
            if (description) {
                description.géreCssDiv.ajouteClasseTemp(KfBootstrap.classeFond('light'), 3000);
            }
        }));
    }

}
