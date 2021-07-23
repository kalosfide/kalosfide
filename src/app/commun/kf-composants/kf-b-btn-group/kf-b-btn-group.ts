import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfCaseACocher } from '../kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfLien } from '../kf-elements/kf-lien/kf-lien';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';

export type KfBBtnGroupElement = KfBouton | KfCaseACocher | KfLien | KfEtiquette;

export class KfBBtnGroup extends KfComposant {
    private pTaille: 'lg' | 'sm';
    vertical: boolean;
    nePasAfficherSiPasDeContenuAAfficher: boolean;

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
        this.noeud.Ajoute(composant.noeud);
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

    get estNonVide(): boolean {
        if (!this.nePasAfficherSiPasDeContenuAAfficher) {
            return true;
        }
        const premierAAfficher = this.contenus.find(c => !c.nePasAfficher)
        return premierAAfficher !== undefined;
    }

    initialiseHtmlContenus(divElement: HTMLElement) {
        for (let index = 0; index < this.contenus.length; index++) {
            const composant = this.contenus[index];
            let htmlElement = divElement.children[index] as HTMLElement;
            switch (composant.type) {
                case KfTypeDeComposant.bouton:
                    const bouton = composant as KfBouton;
                    if (bouton.ngbPopover) {
                        htmlElement = htmlElement.children[0] as HTMLElement;
                    }
                    break;
                case KfTypeDeComposant.caseacocher:
                    const caseACocher = composant as KfCaseACocher;
                    if (caseACocher.classeEntree) {
                        htmlElement = htmlElement.children[0] as HTMLElement;
                    }
                    break;
                default:
                    break;

            }
            composant.initialiseHtml(htmlElement, null);
        }
    }
}
