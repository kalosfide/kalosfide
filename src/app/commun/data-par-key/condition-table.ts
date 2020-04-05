import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { Conditions } from '../condition/condition';

export enum ModeTable {
    edite = 'edite',
    aperçu = 'aperçu',
    bilan = 'bilan',
    sans = 'sans'
}

export class ConditionTable extends Conditions<ModeTable> {

    constructor(modeTableIo: KfInitialObservable<ModeTable>) {
        super();
        this.observe([ModeTable.aperçu, ModeTable.bilan, ModeTable.edite], modeTableIo);
        this.nom = 'table';
    }

    get edition(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeTable.edite);
    }
    get aperçu(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeTable.aperçu);
    }
    get bilan(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeTable.bilan);
    }
    get pasEdition(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeTable.edite);
    }
    get pasAperçu(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeTable.aperçu);
    }
    get pasBilan(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeTable.bilan);
    }

}
