import { Site } from '../../modeles/site/site';
import { IdEtatSite } from '../../modeles/etat-site';
import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { NavigationService } from 'src/app/services/navigation.service';
import { Conditions } from '../condition/condition';

export class ConditionEtatSite extends Conditions<IdEtatSite> {

    constructor(navigation: NavigationService) {
        super();
        this.nom = 'site';
        this.observeObjet<Site>(
            [IdEtatSite.aucun, IdEtatSite.catalogue, IdEtatSite.ouvert],
            (site: Site): IdEtatSite => site ? site.etat : IdEtatSite.aucun,
            KfInitialObservable.nouveau(navigation.litSiteEnCours(), navigation.siteObs())
        );
    }

    get catalogue(): KfInitialObservable<boolean> {
        return this.conditionIO(IdEtatSite.catalogue);
    }

    get ouvert(): KfInitialObservable<boolean> {
        return this.conditionIO(IdEtatSite.ouvert);
    }
}
