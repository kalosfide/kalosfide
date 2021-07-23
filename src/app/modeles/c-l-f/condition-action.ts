import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
import { Conditions } from 'src/app/commun/condition/condition';

export enum ModeAction {
    aperçu = 'aperçu',
    aucun = 'aucun',
    doitCréer = 'doitCréer',
    edite = 'edite',
    envoi = 'envoi',
    envoyé = 'envoyer',
    supprime = 'supprime',
}

export class ConditionAction extends Conditions<ModeAction> {

    constructor(modeActionIo: ValeurEtObservable<ModeAction>) {
        super();
        this.observe([
            ModeAction.aperçu,
            ModeAction.aucun,
            ModeAction.doitCréer,
            ModeAction.edite,
            ModeAction.envoi,
            ModeAction.envoyé,
            ModeAction.supprime
        ], modeActionIo);
        this.nom = 'action';
    }

/*
    get aperçu(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.aperçu);
    }
    get pas_aperçu(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.aperçu);
    }

    get aucun(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.aucun);
    }
    get pas_aucun(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.aucun);
    }
    get doitCréer(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.doitCréer);
    }
    get pas_doitCréer(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.doitCréer);
    }
    get pas_edite(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.edite);
    }
    get pas_envoi(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.envoi);
    }
    get pas_envoyé(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.envoyé);
    }

    get supprime(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeAction.supprime);
    }
    get pas_supprime(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeAction.supprime);
    }
*/
    get edite(): ValeurEtObservable<boolean> {
        return this.conditionIO(ModeAction.edite);
    }

    get envoi(): ValeurEtObservable<boolean> {
        return this.conditionIO(ModeAction.envoi);
    }

    get envoyé(): ValeurEtObservable<boolean> {
        return this.conditionIO(ModeAction.envoyé);
    }

}
