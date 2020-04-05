import { KfTexteDef } from '../kf-texte-def';
import { KfTexte } from '../../kf-elements/kf-texte/kf-texte';
import { KfImage } from '../../kf-elements/kf-image/kf-image';
import { KfIcone } from '../../kf-elements/kf-icone/kf-icone';
import { KfLien } from '../../kf-elements/kf-lien/kf-lien';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfImageDef } from '../kf-image-def';
import { FANomIcone } from '../kf-icone-def';

export type KfTypeContenuPhrasé = KfTexte | KfImage | KfIcone | KfLien;

/**
 * Phrasing content
 */
export class KfContenuPhrase {

    /**
     * composant propriétaire pour lui transmettre les évènements
     */
    composant: KfComposant;
    /**
     * contenus phrasés
     */
    contenus: KfTypeContenuPhrasé[] = [];

    enfantsDeVue: { [key: string]: HTMLElement };

    constructor(
        composant?: KfComposant,
        texte?: KfTexteDef,
    ) {
        this.composant = composant;
        if (texte) {
            this.créeKfTexte(texte);
        }
    }

    ajoute(contenu: KfTypeContenuPhrasé) {
        if (contenu.type === KfTypeDeComposant.lien) {
            contenu.fixeStyleDef('display', 'inline');
            contenu.fixeStyleDef('padding', '0');
        }
        this.contenus.push(contenu);
    }

    fixeContenus(...contenus: KfTypeContenuPhrasé[]) {
        this.contenus = contenus;
    }

    private créeKfTexte(texteDef: KfTexteDef) {
        const t = new KfTexte((this.composant ? this.composant.nom : '') + '_t', texteDef);
        this.contenus.push(t);
    }

    /**
     * retourne le premier contenu qui est un KfTexte
     */
    get kfTexte(): KfTexte {
        return this.contenus.find(c => c.type === KfTypeDeComposant.texte) as KfTexte;
    }

    /**
     * retourne le texte du premier contenu qui est un KfTexte
     */
    get texte(): string {
        const kfTexte = this.kfTexte;
        if (kfTexte) {
            return kfTexte.texte;
        }
    }
    /**
     * fixe le texte du premier contenu qui est un KfTexte ou crée un contenu KfTexte
     */
    fixeTexte(texte: KfTexteDef) {
        const kfTexte = this.kfTexte;
        if (kfTexte) {
            kfTexte.fixeTexte(texte);
        } else {
            this.créeKfTexte(texte);
        }
    }

    private créeKfImage(imageDef: KfImageDef) {
        const t = new KfImage((this.composant ? this.composant.nom : '') + '_img', imageDef);
        this.contenus.push(t);
    }

    /**
     * retourne l'imageDef du premier contenu qui est un KfImage
     */
    get kfImage(): KfImage {
        return this.contenus.find(c => c.type === KfTypeDeComposant.image) as KfImage;
    }
    /**
     * retourne l'imageDef du premier contenu qui est un KfImage
     */
    get imageDef(): KfImageDef {
        const kfImage = this.kfImage;
        if (kfImage) {
            return kfImage.imageDef;
        }
    }
    /**
     * fixe l'imageDef du premier contenu qui est un KfImage ou crée un contenu KfImage
     */
    fixeImage(imageDef: KfImageDef) {
        const kfImage = this.kfImage;
        if (kfImage) {
            kfImage.imageDef = imageDef;
        } else {
            this.créeKfImage(imageDef);
        }
    }

    private créeKfIcone(nomIcone: FANomIcone): KfIcone {
        const kfIcone = new KfIcone((this.composant ? this.composant.nom : '') + '_t', nomIcone);
        this.contenus.push(kfIcone);
        return kfIcone;
    }

    /**
     * retourne l'icone du premier contenu qui est un KfIcone
     */
    get kfIcone(): KfIcone {
        return this.contenus.find(c => c.type === KfTypeDeComposant.icone) as KfIcone;
    }
    /**
     * retourne l'icone du premier contenu qui est un KfIcone
     */
    get icone(): FANomIcone {
        const kfIcone = this.kfIcone;
        if (kfIcone) {
            return kfIcone.icone;
        }
    }
    /**
     * fixe l'icone du premier contenu qui est un KfIcone ou crée un contenu KfIcone
     */
    fixeIcone(nomIcone: FANomIcone): KfIcone {
        const kfIcone = this.kfIcone;
        if (kfIcone) {
            kfIcone.nomIcone = nomIcone;
            return kfIcone;
        } else {
            return this.créeKfIcone(nomIcone);
        }
    }

}
