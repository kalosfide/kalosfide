import { KfClavierTouche } from "./kf-clavier-touche";

export class KfClavierToucheEnfoncée {
    key: KfClavierTouche;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;

    static sontIdentiques(toucheEnfoncée: KfClavierTouche | KfClavierToucheEnfoncée, event: KeyboardEvent): boolean {
        if (!toucheEnfoncée) {
            return false;
        }
        if (typeof(toucheEnfoncée) === 'string') {
            return event.key === toucheEnfoncée && !event.ctrlKey && !event.altKey && !event.shiftKey;
        }
        return event.key === toucheEnfoncée.key
            && !!event.ctrlKey === !!toucheEnfoncée.ctrl
            && !!event.altKey === !!toucheEnfoncée.alt
            && !!event.shiftKey === !!toucheEnfoncée.shift;
    }
    
    static toucheEnfoncée(toucheDef: KfClavierTouche | KfClavierToucheEnfoncée): KfClavierToucheEnfoncée {
        if (toucheDef) {
            if (typeof (toucheDef) === 'string') {
                return { key: toucheDef };
            } else {
                return toucheDef;
            }
        }
    }

}
