import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnGroup, KfBBtnGroupElement } from '../kf-b-btn-group/kf-b-btn-group';
import { KfBBtnToolbarElement } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export class KfVueTableOutilBtnGroupe<T> implements IKfVueTableOutil<T> {
    private pComposant: KfBBtnGroup;
    private pNom: string;

    constructor(nom: string, ...contenus: KfBBtnGroupElement[]) {
        this.pNom = nom;
        this.pComposant = new KfBBtnGroup(nom);
        contenus.forEach(c => this.bbtnGroup.ajoute(c));
    }

    get bbtnGroup(): KfBBtnGroup {
        return this.pComposant as KfBBtnGroup;
    }

    get nom(): string {
        return this.pNom;
    }

    get composant(): KfBBtnToolbarElement {
        return this.pComposant;
    }
}
