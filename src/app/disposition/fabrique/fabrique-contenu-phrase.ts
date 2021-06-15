import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { Couleur } from './fabrique-couleurs';
import { KfIconePositionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone-types';
import { KfContenuPhrase } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export interface IContenuPhraseDef {
    icone?: KfIcone;
    iconeDef?: IKfIconeDef;
    couleurIcone?: Couleur;
    texte?: KfTexteDef;
    positionTexte?: KfIconePositionTexte;
    couleurTexte?: Couleur;
}

export class FabriqueContenuPhrase extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    accepter: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.accepter,
        couleurIcone: Couleur.success,
        texte: 'Accepter',
        positionTexte: 'bas'
    };
    choisit: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.accepter,
        couleurIcone: Couleur.success,
        texte: 'Choisir',
        positionTexte: 'bas'
    };
    edite: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.modifier,
        couleurIcone: Couleur.dark,
        texte: 'Modifier',
        positionTexte: 'bas'
    };
    invite: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.envelope_pleine,
        couleurIcone: Couleur.dark,
        texte: 'Inviter',
        positionTexte: 'bas'
    };
    réinvite: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.envelope,
        couleurIcone: Couleur.dark,
        texte: 'Réinviter',
        positionTexte: 'bas'
    };
    invité: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.envelope,
        couleurIcone: Couleur.dark,
        texte: 'Invité',
        positionTexte: 'bas'
    };
    supprime: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.supprimer,
        couleurIcone: Couleur.dark,
        texte: 'Supprimer',
        positionTexte: 'bas'
    };
    exclure: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.refuser,
        couleurIcone: Couleur.danger,
        texte: 'Exclure',
        positionTexte: 'bas'
    };
    copier: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.copier,
        couleurIcone: Couleur.info,
        texte: 'Auto',
        positionTexte: 'bas'
    };
    annule: IContenuPhraseDef = {
        // icone: this.fabrique.icone.iconeAnnule(),
        iconeDef: this.fabrique.icone.def.refuser,
        couleurIcone: Couleur.dark,
        texte: 'Annuler',
        positionTexte: 'bas'
    };

    prix: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.prix,
        couleurIcone: Couleur.orange,
        texte: 'Prix',
        positionTexte: 'bas'
    };
    prépare: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.modifier,
        couleurIcone: Couleur.dark,
        texte: 'Préparer',
        positionTexte: 'bas'
    };
    abandon: IContenuPhraseDef = {
        iconeDef: this.fabrique.icone.def.liste,
        couleurIcone: Couleur.info,
        texte: 'Annuler',
        positionTexte: 'bas'
    };

    aide(texte?: string): IContenuPhraseDef {
        return {
            iconeDef: this.fabrique.icone.def.question,
            couleurIcone: Couleur.blue,
            texte,
            positionTexte: 'droite',
        };
    }
    info(texte?: string): IContenuPhraseDef {
        return {
            iconeDef: this.fabrique.icone.def.info,
            couleurIcone: Couleur.success,
            texte: texte ? texte : 'Info',
            positionTexte: 'bas'
        };
    }
    avertit(texte?: string): IContenuPhraseDef {
        return {
            iconeDef: this.fabrique.icone.def.danger_cercle,
            couleurIcone: Couleur.warning,
            texte: texte ? texte : 'Alerte',
            positionTexte: 'bas'
        };
    }
    danger(texte?: string): IContenuPhraseDef {
        return {
            iconeDef: this.fabrique.icone.def.danger,
            couleurIcone: Couleur.danger,
            texte: texte ? texte : 'Alerte',
            positionTexte: 'bas'
        };
    }

    retour(texte: string): IContenuPhraseDef {
        return {
            iconeDef: this.fabrique.icone.def.retour,
            texte,
            positionTexte: 'droite'
        };
    }

    ajoute(texte: string): IContenuPhraseDef {
        return {
            iconeDef: this.fabrique.icone.def.ajoute,
            texte,
            positionTexte: 'droite'
        };
    }

    /**
     * si def.iconeDef ou def.icone, si def.texte et def.positionTexte === 'dans', le texte est ajouté en couche dans l'icone
     * @param composant composant avec ContenuPhrase
     * @param def définition des contenus
     */
    fixeDef(composant: KfComposant, def: IContenuPhraseDef) {
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
            contenuPhrase.ajoute(icone);
            if (def.couleurIcone) {
                this.fabrique.couleur.ajouteClasseCouleur(icone, def.couleurIcone, () => {
                    return !composant.inactif;
                });
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
                if (def.couleurTexte) {
                    // vérifie que le géreCss existe
                    if (!icone.texteAvecCss) {
                        icone.créegéreCssTexte();
                    }
                    this.fabrique.couleur.ajouteClasseCouleur(icone.géreCssTexte, def.couleurTexte, () => {
                        return !composant.inactif;
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

}
