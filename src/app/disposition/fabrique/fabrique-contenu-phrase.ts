import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { Couleur } from './fabrique-couleurs';
import { KfIconePositionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone-types';
import { KfContenuPhrase } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';

export interface IContenuPhraseDef {
    icone?: KfIcone;
    nomIcone?: FANomIcone;
    couleurIcone?: Couleur;
    texte?: KfTexteDef;
    positionTexte?: KfIconePositionTexte;
    couleurTexte?: Couleur;
}

export class FabriqueContenuPhrase extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    accepter: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.accepter,
        couleurIcone: Couleur.success,
        texte: 'Accepter',
        positionTexte: 'bas'
    };
    aperçu: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.liste,
        couleurIcone: Couleur.info,
        texte: 'Aperçu',
        positionTexte: 'bas'
    };
    choisit: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.accepter,
        couleurIcone: Couleur.success,
        texte: 'Choisir',
        positionTexte: 'bas'
    };
    edite: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.modifier,
        couleurIcone: Couleur.dark,
        texte: 'Modifier',
        positionTexte: 'bas'
    };
    supprime: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.supprimer,
        couleurIcone: Couleur.dark,
        texte: 'Supprimer',
        positionTexte: 'bas'
    };
    exclure: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.refuser,
        couleurIcone: Couleur.danger,
        texte: 'Exclure',
        positionTexte: 'bas'
    };
    copier: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.copier,
        couleurIcone: Couleur.info,
        texte: 'Auto',
        positionTexte: 'bas'
    };
    annule: IContenuPhraseDef = {
        // icone: this.fabrique.icone.iconeAnnule(),
        nomIcone: this.fabrique.icone.nomIcone.refuser,
        couleurIcone: Couleur.dark,
        texte: 'Annuler',
        positionTexte: 'bas'
    };

    prix: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.prix,
        couleurIcone: Couleur.orange,
        texte: 'Prix',
        positionTexte: 'bas'
    };
    prépare: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.modifier,
        couleurIcone: Couleur.dark,
        texte: 'Préparer',
        positionTexte: 'bas'
    };
    abandon: IContenuPhraseDef = {
        nomIcone: this.fabrique.icone.nomIcone.liste,
        couleurIcone: Couleur.info,
        texte: 'Annuler',
        positionTexte: 'bas'
    };

    aide(texte?: string): IContenuPhraseDef {
        return {
            nomIcone: this.fabrique.icone.nomIcone.question,
            couleurIcone: Couleur.blue,
            texte,
            positionTexte: 'droite',
        };
    }
    info(texte?: string): IContenuPhraseDef {
        return {
            nomIcone: this.fabrique.icone.nomIcone.info,
            couleurIcone: Couleur.success,
            texte: texte ? texte : 'Info',
            positionTexte: 'bas'
        };
    }
    avertit(texte?: string): IContenuPhraseDef {
        return {
            nomIcone: this.fabrique.icone.nomIcone.danger_cercle,
            couleurIcone: Couleur.warning,
            texte: texte ? texte : 'Alerte',
            positionTexte: 'bas'
        };
    }
    danger(texte?: string): IContenuPhraseDef {
        return {
            nomIcone: this.fabrique.icone.nomIcone.danger,
            couleurIcone: Couleur.danger,
            texte: texte ? texte : 'Alerte',
            positionTexte: 'bas'
        };
    }

    retour(texte: string): IContenuPhraseDef {
        return {
            nomIcone: this.fabrique.icone.nomIcone.retour,
            texte,
            positionTexte: 'droite'
        };
    }

    ajoute(texte: string): IContenuPhraseDef {
        return {
            nomIcone: this.fabrique.icone.nomIcone.ajoute,
            texte,
            positionTexte: 'droite'
        };
    }

    /**
     * si def.nomIcone ou def.icone, si def.texte et def.positionTexte === 'dans', le texte est ajouté en couche dans l'icone
     * @param composant composant avec ContenuPhrase
     * @param def définition des contenus
     */
    fixeDef(composant: KfComposant, def: IContenuPhraseDef) {
        const contenuPhrase = new KfContenuPhrase();

        let icone: KfIcone = def.icone;
        if (def.nomIcone) {
            if (icone) {
                icone.nomIcone = def.nomIcone;
            } else {
                icone = this.fabrique.icone.icone(def.nomIcone);
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
                        composant.ajouteClasseDef('texte-sous-icone');
                        break;
                    case 'gauche':
                        icone.ajouteClasseDef('ml-2');
                        break;
                    case 'droite':
                        icone.ajouteClasseDef('mr-1');
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
