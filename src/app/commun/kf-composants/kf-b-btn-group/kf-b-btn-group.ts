import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfCaseACocher } from '../kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfLien } from '../kf-elements/kf-lien/kf-lien';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';
import { KfEvenement, KfTypeDEvenement } from '../kf-partages/kf-evenements';

export type KfBBtnGroupElement = KfBouton | KfCaseACocher | KfLien | KfEtiquette;

export class KfBBtnGroup extends KfComposant {
    private pTaille: 'lg' | 'sm';
    vertical: boolean;

    constructor(nom: string) {
        super(nom, KfTypeDeComposant.b_btn_group);
    }

    get typeContenu(): KfTypeDeComposant {
        if (this.noeud.enfant) {
            return (this.noeud.enfant.objet as KfComposant).type;
        }
    }

    ajoute(composant: KfBBtnGroupElement) {
        let types = [KfTypeDeComposant.caseacocher, KfTypeDeComposant.bouton, KfTypeDeComposant.lien, KfTypeDeComposant.etiquette];
        if (this.noeud.enfant) {
            const type = (this.noeud.enfant.objet as KfComposant).type;
            types = types.filter(t => t === type);
        }

        /*
        if (types.find(t => t === composant.type) === undefined) {
            throw new Error(`On ne peut ajouter que des composants de type ${types.join(' ou ')} à ${this.nom}`);
        }
        */
        if (composant.type === KfTypeDeComposant.bouton) {
            (composant as KfBouton).btnGroupe = this;
        }
        this.noeud.Ajoute(composant.noeud);
    }

    estBouton(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.bouton;
    }

    estLien(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.lien;
    }

    estEtiquette(composant: KfComposant): boolean {
        return composant.type === KfTypeDeComposant.etiquette;
    }

    taille(taille: 'lg' | 'sm') {
        this.pTaille = taille;
    }

    get popoverGroupeClasse(): string {
        const préfixe = 'btn-group';
        let classe = préfixe;
        if (this.pTaille) {
            classe = classe + ' ' + préfixe + '-' + this.pTaille;
        }
        return classe;
    }

    get groupeClasse(): string {
        const préfixe = 'btn-group';
        let classe = préfixe;
        if (this.pTaille) {
            classe = classe + ' ' + préfixe + '-' + this.pTaille;
        }
        if (this.vertical) {
            classe = classe + ' ' + préfixe + '-' + 'vertical';
        }
        return classe;
    }

    initialiseHtmlContenus() {}
}
