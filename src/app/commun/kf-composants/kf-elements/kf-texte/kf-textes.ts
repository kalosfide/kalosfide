import { KfTypeDeBaliseHTML } from "../../kf-composants-types";
import { KfStringDef } from "../../kf-partages/kf-string-def";

export interface IKfstringDef {
    nom?: string;
    texte: KfStringDef;
    balise?: KfTypeDeBaliseHTML;
    suiviDeSaut?: boolean;
    classe?: string;
}

export type KfstringDef = string | IKfstringDef;
export type KfstringDefs = KfstringDef | KfstringDef[];
