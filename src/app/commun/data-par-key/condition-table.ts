import { ValeurEtObservable } from '../outils/valeur-et-observable';
import { Conditions } from '../condition/condition';

export enum ModeTable {
    edite = 'edite',
    aperçu = 'aperçu',
    sans = 'sans'
}

export class ConditionTable extends Conditions<ModeTable> {

    constructor(modeTableIo: ValeurEtObservable<ModeTable>) {
        super();
        this.observe([ModeTable.aperçu, ModeTable.edite], modeTableIo);
        this.nom = 'table';
    }

    get edition(): ValeurEtObservable<boolean> {
        return this.conditionIO(ModeTable.edite);
    }
    get aperçu(): ValeurEtObservable<boolean> {
        return this.conditionIO(ModeTable.aperçu);
    }

}
