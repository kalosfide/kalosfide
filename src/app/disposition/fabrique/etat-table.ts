import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { GroupeBoutonsMessages } from './fabrique-formulaire';

export interface IEtatTableDef {
    nePasAfficherSiPasVide: boolean;
    nbMessages: number;
    avecSolution: boolean;
    charge(EtatTable: EtatTable): void;
}

export class EtatTable {
    grBtnsMsgs: GroupeBoutonsMessages;
    def: IEtatTableDef;

    constructor(grBtnsMsgs: GroupeBoutonsMessages, def: IEtatTableDef) {
        this.grBtnsMsgs = grBtnsMsgs;
        this.def = def;
    }

    get nePasAfficherSiPasVide(): boolean {
        return this.def.nePasAfficherSiPasVide;
    }

    get groupe(): KfGroupe { return this.grBtnsMsgs.groupe; }

    charge() {
        this.def.charge(this);
    }
}
