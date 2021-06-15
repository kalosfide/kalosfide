import { IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnGroup, KfBBtnGroupElement } from '../kf-b-btn-group/kf-b-btn-group';
import { KfComposant } from '../kf-composant/kf-composant';

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

    get composant(): KfComposant {
        return this.pComposant;
    }
}
