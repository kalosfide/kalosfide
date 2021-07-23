import { Site } from '../../modeles/site/site';
import { IdEtatSite } from '../../modeles/etat-site';
import { ValeurEtObservable } from '../outils/valeur-et-observable';
import { NavigationService } from 'src/app/services/navigation.service';
import { Conditions } from '../condition/condition';

export class ConditionEtatSite extends Conditions<IdEtatSite> {

    constructor(navigation: NavigationService) {
        super();
        this.nom = 'site';
        this.observeObjet<Site>(
            [IdEtatSite.aucun, IdEtatSite.catalogue, IdEtatSite.ouvert],
            (site: Site): IdEtatSite => site ? site.etat : IdEtatSite.aucun,
            ValeurEtObservable.nouveau(navigation.litSiteEnCours(), navigation.siteObs())
        );
    }

    get catalogue(): ValeurEtObservable<boolean> {
        return this.conditionIO(IdEtatSite.catalogue);
    }

    get ouvert(): ValeurEtObservable<boolean> {
        return this.conditionIO(IdEtatSite.ouvert);
    }
}
