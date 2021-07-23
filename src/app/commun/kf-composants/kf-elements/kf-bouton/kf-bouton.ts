import { KfTypeDeComposant, KfTypeDeBouton } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { IKfNgbPopoverDef } from './kf-ngb-popover';
import { KfIcone } from '../kf-icone/kf-icone';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfGroupe } from '../../kf-groupe/kf-groupe';
import { IKfAvecSurvol } from '../../kf-partages/kf-survol/i-kf-avec-survol';
import { KfSurvol } from '../../kf-partages/kf-survol/kf-survol';
import { IKfSurvole } from '../../kf-partages/kf-survol/i-kf-survole';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';

export class KfBouton extends KfComposant implements IKfAvecSurvol {
    private pTypeDeBouton: KfTypeDeBouton;
    /**
     * Présent si le type de bouton est submit ou reset
     */
    private pFormulaire: KfGroupe;

    private pNgbPopover: IKfNgbPopoverDef;
    /**
     * Icone affichée dans le bouton s'il ouvre un NgbPopOver.
     */
    private pIconePopover: KfIcone;

    /**
     * Composant affichant une icone ou un BootstrapSpinner centré au dessus du bouton que l'on peut montrer ou cacher.
     */
     private pSurvol: KfSurvol;
     /**
      * GéreCss de la div ajoutée à l'intérieur du bouton pour son contenu phrasé et l'icone ou le BootstrapSpinner
      */
     private pConteneurSurvolé: KfGéreCss;

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, KfTypeDeComposant.bouton);
        this.pTypeDeBouton = 'button';
        this.contenuPhrase = new KfContenuPhrase(this, texte);
    }

    get typeDeBouton(): KfTypeDeBouton {
        return this.pTypeDeBouton;
    }
    fixeTypeDeBouton(typeDeBouton: 'submit' | 'reset', formulaire: KfGroupe) {
        this.pTypeDeBouton = typeDeBouton;
        this.pFormulaire = formulaire;
        this.gereHtml.fixeAttribut('form', formulaire.nom);
    }
    get formulaire(): KfGroupe {
        return this.pFormulaire;
    }

    get ngbPopover(): IKfNgbPopoverDef {
        return this.pNgbPopover;
    }
    set ngbPopover(def: IKfNgbPopoverDef) {
        this.pNgbPopover = def;
        if (def && def.iconeDef) {
            this.pIconePopover = new KfIcone('', def.iconeDef);
            this.pIconePopover.ajouteClasse('kf-popover-icone');
        } else {
            this.pIconePopover = undefined;
        }
    }
    get iconePopover(): KfIcone {
        return this.pIconePopover;
    }

    get contenuAAfficher(): KfContenuPhrase {
        if (this.pIconePopover) {
            const àAfficher = new KfContenuPhrase();
            àAfficher.contenus = this.contenuPhrase.contenus.concat([this.pIconePopover]);
            return àAfficher;
        }
        return this.contenuPhrase;
    }

    /// Interface IKfAvecSurvol ///

    /**
     * Composant affichant une icone ou un BootstrapSpinner centré au dessus du bouton que l'on peut montrer ou cacher.
     */
     get survol(): KfSurvol {
        return this.pSurvol;
    }
    /**
     * Crée le composant affichant une icone ou un BootstrapSpinner centré au dessus du bouton que l'on peut montrer ou cacher.
     */
     créeSurvol(survole: IKfSurvole) {
        this.pConteneurSurvolé = new KfGéreCss();
        this.pSurvol = new KfSurvol(this, survole, { avecSurvolInactifPendantSurvol: true });
        this.contenuPhrase.contenus.forEach(c => {
            if (c.type === KfTypeDeComposant.icone) {
                (c as KfIcone).créeFond();
            }
        });
    }
     /**
      * GéreCss de la div ajoutée à l'intérieur du bouton pour son contenu phrasé et l'icone ou le BootstrapSpinner
      */
      get conteneurSurvolé(): KfGéreCss {
        return this.pConteneurSurvolé;
    }
    get classeSurvol(): KfNgClasse {
        return this.pConteneurSurvolé.classe;
    }
    /**
     * Array des KfGéreCss des contenus (autre que l'icone) de l'élément html qui contient
     * l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    get contenusSurvolés(): KfGéreCss[] {
        return this.contenuPhrase.contenus.map(c => {
            if (c.type === KfTypeDeComposant.icone) {
                return (c as KfIcone).fond;
            }
            return c;
        });
    }

    get actionSurvol(): {
        commence: () => void,
        finit: () => void
    } {
        let inactivité: boolean;
        return {
            commence: () => {
                inactivité = this.inactivité;
                this.inactivité = true;
            },
            finit: () => {
                this.inactivité = inactivité;
            }
        }
    }
    /// Fin Interface IKfAvecIconeSurvol ///

}
