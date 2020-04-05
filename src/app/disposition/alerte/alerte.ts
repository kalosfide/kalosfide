import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { BootstrapType } from '../fabrique/fabrique-bootstrap';

export enum TypeAlerte {
    success = 1,
    danger,
    info,
    warning
}

export class Alerte {
    id: string;
    contenu: KfEtiquette;
    type: BootstrapType;
    fermable: boolean;
    fermetureAuto: number;
    nbNavigationAvantFermeture: number;
    invisible: boolean;
    inutile: (url: string) => boolean;

    vérifieUrl(url: string) {
        this.invisible = this.inutile && this.inutile(url);
    }

}
