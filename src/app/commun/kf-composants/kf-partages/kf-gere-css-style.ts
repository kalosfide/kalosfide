import { KfStringDef } from './kf-string-def';

export class KfNgStyleDef {
    nom: string;
    valeur: KfStringDef;
    active?: () => boolean;

    clone(): KfNgStyleDef {
        const def = new KfNgStyleDef();
        def.nom = this.nom;
        def.valeur = this.valeur;
        def.active = this.active;
        return def;
    }
}

export interface KfNgStyle { [keys: string]: any; }
