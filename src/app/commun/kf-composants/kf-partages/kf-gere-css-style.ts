import { KfTexteDef } from './kf-texte-def';

export class KfNgStyleDef {
    nom: string;
    valeur: KfTexteDef;
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
