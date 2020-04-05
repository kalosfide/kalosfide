import { KfTypeDeComposant } from '../kf-composants-types';
import { KfBBtnGroup } from '../kf-b-btn-group/kf-b-btn-group';
import { KfInputTexte } from '../kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../kf-elements/kf-input/kf-input-nombre';
import { KfListeDeroulanteTexte, KfListeDeroulanteNombre } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfInput, KfTypeDInput } from '../kf-elements/kf-input/kf-input';
import { KfComposant } from '../kf-composant/kf-composant';

export type KfBBtnToolbarInputGroup = KfInputTexte | KfInputNombre | KfListeDeroulanteTexte | KfListeDeroulanteNombre;

export type KfBBtnToolbarElement = KfBBtnGroup | KfBBtnToolbarInputGroup;

export class KfBBtnToolbar extends KfGroupe {
    constructor(nom: string) {
        super(nom);
        this.type = KfTypeDeComposant.b_btn_toolbar;
    }

    estBtnGroup(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.b_btn_group;
    }
    estListederoulante(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.listederoulante;
    }
    estInput(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.input
            && ((composant as KfInput).typeDInput === KfTypeDInput.nombre || (composant as KfInput).typeDInput === KfTypeDInput.texte);
    }

    ajoute(composant: KfBBtnToolbarElement) {
        if (this.estBtnGroup(composant) || this.estInput(composant) || this.estListederoulante(composant)) {
            this.noeud.Ajoute(composant.noeud);
            return;
        }
        throw new Error(`On ne peut ajouter que des KfBBtnGroup ou des KfInput ou KfListeDeroulante Texte ou Nombre à ${this.nom}`);
    }
}
