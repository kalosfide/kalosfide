import { KfClavierTouche } from "./kf-clavier-touche";

export class KfClavierEdition {
    commence?: KfClavierTouche;
    rétablit?: KfClavierTouche;
    soumet?: KfClavierTouche;

    static parDéfaut(): KfClavierEdition {
        return {
            commence: 'F2',
            rétablit: 'Escape',
            soumet: 'Enter'
        };
    }
}