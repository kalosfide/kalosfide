import { Site } from '../../modeles/site/site';
import { ValeurEtObservable } from '../outils/valeur-et-observable';
import { NavigationService } from 'src/app/services/navigation.service';
import { Conditions } from '../condition/condition';

enum IdEtatSite {
    ouvert = 'O',
    catalogue = 'C',
    aucun = 'aucun'
}

export class ConditionEtatSite extends Conditions<IdEtatSite> {

    constructor(valeurEtObservableSite: ValeurEtObservable<Site>) {
        super();
        this.nom = 'site';
        this.observeObjet<Site>(
            [IdEtatSite.aucun, IdEtatSite.catalogue, IdEtatSite.ouvert],
            (site: Site): IdEtatSite => site ? site.ouvert ? IdEtatSite.ouvert : IdEtatSite.catalogue : IdEtatSite.aucun,
            valeurEtObservableSite
        );
    }

    get catalogue(): ValeurEtObservable<boolean> {
        return this.conditionIO(IdEtatSite.catalogue);
    }

    get ouvert(): ValeurEtObservable<boolean> {
        return this.conditionIO(IdEtatSite.ouvert);
    }
}
