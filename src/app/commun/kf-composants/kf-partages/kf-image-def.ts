import { KfStringDef } from './kf-string-def';
import { KfNombreDef } from './kf-nombre-def';

export interface KfImageDef {
    urlDef: KfStringDef;
    largeurDef?: KfNombreDef;
    hauteurDef?: KfNombreDef;
}
