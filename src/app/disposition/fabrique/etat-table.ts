import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { ILienDef } from './fabrique-lien';
import { BootstrapType } from './fabrique-bootstrap';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from './fabrique';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTypeContenuPhrasé } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
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
