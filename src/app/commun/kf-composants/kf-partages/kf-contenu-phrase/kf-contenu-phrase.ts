import { KfStringDef } from '../kf-string-def';
import { KfTexte } from '../../kf-elements/kf-texte/kf-texte';
import { KfImage } from '../../kf-elements/kf-image/kf-image';
import { KfIcone } from '../../kf-elements/kf-icone/kf-icone';
import { KfLien } from '../../kf-elements/kf-lien/kf-lien';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfImageDef } from '../kf-image-def';
import { IKfIconeDef } from '../kf-icone-def';
import { IKfstringDef, KfstringDef, KfstringDefs } from '../../kf-elements/kf-texte/kf-textes';

export type KfTypeContenuPhrasé = KfTexte | KfImage | KfIcone | KfLien;

export type KfContenuPhraséDef = KfstringDef | KfTypeContenuPhrasé;
export type KfContenuPhraséDefs = KfContenuPhraséDef | KfContenuPhraséDef[];

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

    constructor(
        composant?: KfComposant,
        texte?: KfStringDef,
    ) {
        this.composant = composant;
        if (texte) {
            this.créeKfTexte(texte);
        }
    }

    private créeKfTexte(stringDef: KfStringDef) {
        const t = new KfTexte((this.composant ? this.composant.nom : '') + '_t', stringDef);
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
    fixeTexte(texte: KfStringDef) {
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

    private créeKfIcone(iconeDef: IKfIconeDef): KfIcone {
        const kfIcone = new KfIcone((this.composant ? this.composant.nom : '') + '_t', iconeDef);
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
    get icone(): IKfIconeDef {
        const kfIcone = this.kfIcone;
        if (kfIcone) {
            return kfIcone.icone;
        }
    }
    /**
     * fixe l'icone du premier contenu qui est un KfIcone ou crée un contenu KfIcone
     */
    fixeIcone(iconeDef: IKfIconeDef): KfIcone {
        const kfIcone = this.kfIcone;
        if (kfIcone) {
            kfIcone.iconeDef = iconeDef;
            return kfIcone;
        } else {
            return this.créeKfIcone(iconeDef);
        }
    }

    private créeKfTextes(...textes: KfstringDefs[]): KfTexte[] {
        const kfTextes: KfTexte[] = [];
        textes.forEach(t => {
            const kfTexte = new KfTexte('', '');
            if (typeof (t) === 'string') {
                kfTexte.fixeTexte(t);
            } else {
                if (Array.isArray(t)) {
                    t.forEach(t1 => kfTextes.push(...this.créeKfTextes(t1)));
                } else {
                    if (t.nom) {
                        kfTexte.nom = t.nom;
                    }
                    kfTexte.fixeTexte(t.texte);
                    if (t.balise) {
                        kfTexte.balisesAAjouter = [t.balise];
                    }
                    kfTexte.suiviDeSaut = t.suiviDeSaut;
                    if (t.classe) {
                        kfTexte.ajouteClasse(t.classe);
                    }
                }
            }
            kfTextes.push(kfTexte);
        });
        return kfTextes;
    }

    /**
     * Ajoute aux contenus des KfTexte avec balise Html, retourne l'array des KfTexte créés
     * @param defs string à ajouter
     */
    ajouteTextes(...defs: KfstringDefs[]): KfTexte[] {
        const kfTextes: KfTexte[] = this.créeKfTextes(...defs);
        this.contenus.push(...kfTextes);
        return kfTextes;
    }

    /**
     * Remplace les contenus par des KfTexte avec balise Html, retourne l'array des KfTexte créés
     * @param defs string à ajouter
     */
    fixeTextes(...defs: KfstringDefs[]): KfTexte[] {
        const kfTextes: KfTexte[] = this.créeKfTextes(...defs);
        this.contenus = kfTextes;
        return kfTextes;
    }

    private créeContenus(...defs: KfContenuPhraséDefs[]): KfTypeContenuPhrasé[] {
        const contenus: KfTypeContenuPhrasé[] = [];
        defs.forEach(def => {
                const kfTexte = new KfTexte('', '');
            if (typeof (def) === 'string') {
                kfTexte.fixeTexte(def);
                contenus.push(kfTexte);
            } else {
                if (Array.isArray(def)) {
                    def.forEach(t1 => contenus.push(...this.créeContenus(t1)));
                } else {
                    switch ((def as KfComposant).type) {
                        case KfTypeDeComposant.texte:
                            contenus.push(def as KfTexte);
                            break;
                        case KfTypeDeComposant.icone:
                            contenus.push((def as KfIcone));
                            break;
                        case KfTypeDeComposant.image:
                            contenus.push((def as KfImage));
                            break;
                        case KfTypeDeComposant.lien:
                            contenus.push((def as KfLien));
                            break;
                        default:
                            const kfstringDef = def as IKfstringDef;
                            if (kfstringDef.nom) {
                                kfTexte.nom = def.nom;
                            }
                            kfTexte.fixeTexte(kfstringDef.texte);
                            if (kfstringDef.balise) {
                                kfTexte.balisesAAjouter = [kfstringDef.balise];
                            }
                            kfTexte.suiviDeSaut = kfstringDef.suiviDeSaut;
                            if (kfstringDef.classe) {
                                kfTexte.ajouteClasse(kfstringDef.classe);
                            }
                            contenus.push(kfTexte);
                            break;
                    }
                }
            }
        });
        return contenus;
    }

    /**
     * Ajoute des contenus phrasés. Retourne l'array des contenus ajoutés
     * @param defs si defs est de type string | () => string | (string | () => string)[], un KfTexte est créé et ajouté;
     * si defs est de type KfTexte | KfImage | KfIcone | KfLien, defs est ajouté
     */
     ajouteContenus(...defs: KfContenuPhraséDefs[]): KfTypeContenuPhrasé[] {
        const contenus = this.créeContenus(...defs);
        this.contenus.push(...contenus);
        return contenus;
    }

    /**
     * Fixe les contenus phrasés. Retourne l'array des contenus ajoutés
     * @param defs si defs est de type string | () => string | (string | () => string)[], un KfTexte est créé et ajouté;
     * si defs est de type KfTexte | KfImage | KfIcone | KfLien, defs est ajouté
     */
     fixeContenus(...defs: KfContenuPhraséDefs[]): KfTypeContenuPhrasé[] {
        const contenus = this.créeContenus(...defs);
        this.contenus = contenus;
        return contenus;
    }

}
