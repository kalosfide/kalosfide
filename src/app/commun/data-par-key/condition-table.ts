import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { Conditions } from '../condition/condition';

export enum ModeTable {
    edite = 'edite',
    aperçu = 'aperçu',
    sans = 'sans'
}

export class ConditionTable extends Conditions<ModeTable> {

    constructor(modeTableIo: KfInitialObservable<ModeTable>) {
        super();
        this.observe([ModeTable.aperçu, ModeTable.edite], modeTableIo);
        this.nom = 'table';
    }

    get edition(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeTable.edite);
    }
    get aperçu(): KfInitialObservable<boolean> {
        return this.conditionIO(ModeTable.aperçu);
    }
    get pasEdition(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeTable.edite);
    }
    get pasAperçu(): KfInitialObservable<boolean> {
        return this.pas_conditionIO(ModeTable.aperçu);
    }

}
