import { Site } from '../../modeles/site/site';
import { IdEtatSite } from '../../modeles/etat-site';
import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { NavigationService } from 'src/app/services/navigation.service';
import { Conditions } from '../condition/condition';

export class ConditionEtatSite extends Conditions<IdEtatSite> {

    constructor(navigation: NavigationService) {
        super();
        const o0 = KfInitialObservable.nouveau(navigation.litSiteEnCours(), navigation.siteObs());
        this.nom = 'site';
        const o = KfInitialObservable.transforme(o0, (site: Site): IdEtatSite => site ? site.etat : IdEtatSite.aucun);
        o.nom = 'ConditionEtatSite';
        o.observable.subscribe(v => console.log('transforme ' + v));
        this.observe(
            [IdEtatSite.aucun, IdEtatSite.catalogue, IdEtatSite.ouvert],
            o
        );
    }

    get catalogue(): KfInitialObservable<boolean> {
        return this.conditionIO(IdEtatSite.catalogue);
    }

    get pas_catalogue(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(IdEtatSite.catalogue);
    }

    get ouvert(): KfInitialObservable<boolean> {
        return this.conditionIO(IdEtatSite.ouvert);
    }

    get pas_ouvert(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(IdEtatSite.ouvert);
    }
}
