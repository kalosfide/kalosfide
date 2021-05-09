import { KfTypeDeComposant, KfTypeDeBouton } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { IKfNgbPopoverDef } from './kf-ngb-popover';
import { IKfAvecIconeSurvol, KfIcone } from '../kf-icone/kf-icone';
import { KfBBtnGroup } from '../../kf-b-btn-group/kf-b-btn-group';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfGroupe } from '../../kf-groupe/kf-groupe';

export class KfBouton extends KfComposant implements IKfAvecIconeSurvol {
    private pTypeDeBouton: KfTypeDeBouton;
    /**
     * Présent si le type de bouton est submit ou reset
     */
    private pFormulaire: KfGroupe;

    private pNgbPopover: IKfNgbPopoverDef;
    private pIconePopover: KfIcone;

    btnGroupe: KfBBtnGroup;

    /**
     * Icone affichée dans le bouton s'il ouvre un NgbPopOver ou icone affichée par dessus le bouton que l'on peut montrer ou cacher.
     */
    private pIconeSurvol: KfIcone;

    constructor(nom: string, texte?: KfTexteDef) {
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
    }
    get formulaire(): KfGroupe {
        return this.pFormulaire;
    }

    get ngbPopover(): IKfNgbPopoverDef {
        return this.pNgbPopover;
    }
    set ngbPopover(def: IKfNgbPopoverDef) {
        this.pNgbPopover = def;
        if (def && def.nomIcone) {
            this.pIconePopover = new KfIcone('', def.nomIcone);
            this.pIconePopover.ajouteClasse('kf-popover-icone');
        } else {
            this.pIconePopover = undefined;
        }
    }
    get iconePopover(): KfIcone {
        return this.pIconePopover;
    }

    get contenuAAfficher(): KfContenuPhrase {
        const iconePopoverOuSurvol = this.pIconePopover ? this.pIconePopover : this.pIconeSurvol;
        if (iconePopoverOuSurvol) {
            const àAfficher = new KfContenuPhrase();
            àAfficher.contenus = this.contenuPhrase.contenus.concat([iconePopoverOuSurvol]);
            return àAfficher;
        }
        return this.contenuPhrase;
    }

    /// Interface IKfAvecIconeSurvol ///
    /**
     * Icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    get iconeSurvol(): KfIcone {
        return this.pIconeSurvol;
    }
    /**
     * Ajoute une icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    ajouteIconeSurvol(icone: KfIcone) {
        this.pIconeSurvol = icone;
        this.contenuPhrase.contenus.forEach(c => {
            if (c.type === KfTypeDeComposant.icone) {
                (c as KfIcone).créegéreCssFond();
            }
        });
    }
    /**
     * KfGéreCss de l'élément html qui contient l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    get conteneurSurvolé(): KfGéreCss {
        return this;
    }
    /**
     * Array des KfGéreCss des contenus (autre que l'icone) de l'élément html qui contient
     * l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    get contenusSurvolés(): KfGéreCss[] {
        return this.contenuPhrase.contenus            .map(c => {
            if (c.type === KfTypeDeComposant.icone) {
                return (c as KfIcone).géreCssFond;
            }
            return c;
        });
    }
    /// Fin Interface IKfAvecIconeSurvol ///

}
