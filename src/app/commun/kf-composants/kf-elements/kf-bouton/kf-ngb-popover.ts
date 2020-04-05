import { KfEtiquette } from '../kf-etiquette/kf-etiquette';
import { KfComposant } from '../../kf-composant/kf-composant';
import { FANomIcone } from '../../kf-partages/kf-icone-def';

export type KfTypeNgbPopoverPlacement =  'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' |
    'left' | 'left-top' | 'left-bottom' | 'right' | 'right-top' | 'right-bottom';

export interface IKfNgbPopoverDef {
    titre?: KfEtiquette;
    contenus: KfComposant[];
    autoClose?: boolean | 'inside' | 'outside';
    placement?: KfTypeNgbPopoverPlacement | KfTypeNgbPopoverPlacement[];
    container?: 'body';
    nomIcone?: FANomIcone;
}
