import { KfVueTableOutils } from './kf-vue-table-outils';
import { KfBBtnToolbarElement } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export interface IKfVueTableOutilVue {
    composant: KfBBtnToolbarElement;
}

export interface IKfVueTableOutil<T> extends IKfVueTableOutilVue {
    nom: string;
    valide?: (t: T) => boolean;
    initialise?: (parent: KfVueTableOutils<T>) => void;
    filtreActif?: boolean;
}
