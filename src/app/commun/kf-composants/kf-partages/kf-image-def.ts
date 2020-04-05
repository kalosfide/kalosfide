import { KfTexteDef } from './kf-texte-def';
import { KfNombreDef } from './kf-nombre-def';

export interface KfImageDef {
    urlDef: KfTexteDef;
    largeurDef?: KfNombreDef;
    hauteurDef?: KfNombreDef;
}
