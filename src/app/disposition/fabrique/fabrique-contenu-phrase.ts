import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { KfIconePositionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone-types';
import { KfContenuPhrase } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfTypeDeComposant } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';

export interface IContenuPhraséDef {
    icone?: KfIcone;
    iconeDef?: IKfIconeDef;
    classeIcone?: string;
    texte?: KfStringDef;
    positionTexte?: KfIconePositionTexte;
    classeTexte?: string;
}

export class FabriqueContenuPhrasé extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    activer(): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.accepter,
            classeIcone: KfBootstrap.texteColor().classe('success'),
            texte: 'Activer',
            positionTexte: 'bas'
        };
    }
    choisit(): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.accepter,
            classeIcone: KfBootstrap.texteColor().classe('success'),
            texte: 'Choisir',
            positionTexte: 'bas'
        };
    }
    édite(): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.modifier,
            classeIcone: KfBootstrap.texteColor().classe('dark'),
            texte: 'Modifier',
            positionTexte: 'bas'
        };
    }
    supprime(): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.supprimer,
            classeIcone: KfBootstrap.texteColor().classe('dark'),
            texte: 'Supprimer',
            positionTexte: 'bas',
        };
    }
    fermer(): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.refuser,
            classeIcone: KfBootstrap.texteColor().classe('danger'),
            texte: 'Fermer',
            positionTexte: 'bas'
        };
    }
    copier(): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.copier,
            classeIcone: KfBootstrap.texteColor().classe('info'),
            texte: 'Auto',
            positionTexte: 'bas'
        };
    }
    annule(): IContenuPhraséDef {
        return {
            // icone: this.fabrique.icone.iconeAnnule(),
            iconeDef: this.fabrique.icone.def.refuser,
            classeIcone: KfBootstrap.texteColor().classe('dark'),
            texte: 'Annuler',
            positionTexte: 'bas'
        };
    }
    inviter(): IContenuPhraséDef { return  {
        iconeDef: this.fabrique.icone.def.envelope_pleine,
        classeIcone: KfBootstrap.texteColor().classe('dark'),
        texte: 'Inviter',
        positionTexte: 'bas'
    };}

    réinviter(): IContenuPhraséDef { return  {
        iconeDef: this.fabrique.icone.def.envelope,
        classeIcone: KfBootstrap.texteColor().classe('dark'),
        texte: 'Réinviter',
        positionTexte: 'bas'
    };}

    invité(email: string): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.envelope,
            classeIcone: KfBootstrap.texteColor().classe('dark'),
            texte: email,
            positionTexte: 'bas'
        };
    }

    aide(texte?: string): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.question,
            classeIcone: KfBootstrap.texteColor().classe('primary'),
            texte,
            positionTexte: 'droite',
        };
    }
    danger(texte?: string): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.danger,
            classeIcone: KfBootstrap.texteColor().classe('danger'),
            texte: texte ? texte : 'Alerte',
            positionTexte: 'bas'
        };
    }

    retour(texte: string): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.retour,
            texte,
            positionTexte: 'droite'
        };
    }

    ajoute(texte: string): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.ajoute,
            texte,
            positionTexte: 'droite'
        };
    }

    rafraichit(texte?: string): IContenuPhraséDef {
        return {
            iconeDef: this.fabrique.icone.def.rafraichit,
            texte: texte ? texte : 'Rafraichir',
            positionTexte: 'droite'
        };
    }

    /**
     * si def.iconeDef ou def.icone, si def.texte et def.positionTexte === 'dans', le texte est ajouté en couche dans l'icone
     * @param composant composant avec ContenuPhrase
     * @param def définition des contenus
     */
    fixeDef(composant: KfComposant, def: IContenuPhraséDef) {
        const contenuPhrase = new KfContenuPhrase();

        let icone: KfIcone = def.icone;
        if (def.iconeDef) {
            if (icone) {
                icone.iconeDef = def.iconeDef;
            } else {
                icone = this.fabrique.icone.icone(def.iconeDef);
            }
        }
        if (icone) {
            contenuPhrase.ajouteContenus(icone);
            if (def.classeIcone) {
                icone.ajouteClasse({ nom: def.classeIcone, active: () => !composant.inactif });
            }

            if (def.texte !== undefined) {
                switch (def.positionTexte) {
                    case 'bas':
                        composant.ajouteClasse('texte-sous-icone');
                        break;
                    case 'gauche':
                        icone.ajouteClasse('ml-2');
                        break;
                    case 'droite':
                        icone.ajouteClasse('mr-1');
                        break;
                    default:
                        break;
                }
                icone.ajouteTexte(def.texte, def.positionTexte);
                if (def.classeTexte) {
                    // vérifie que le géreCss existe
                    if (!icone.texteAvecCss) {
                        icone.créegéreCssTexte();
                    }
                    icone.géreCssTexte.ajouteClasse({
                        nom: def.classeTexte, active: () => {
                            return !composant.inactif;
                        }
                    });
                }
            }

        } else {
            if (def.texte !== undefined) {
                contenuPhrase.fixeTexte(def.texte);
            }
        }
        composant.contenuPhrase = contenuPhrase;
    }

    kfIcone(composant: KfComposant): KfIcone {
        return composant.contenuPhrase.contenus.find(c => c.type === KfTypeDeComposant.icone) as KfIcone;
    }

}
