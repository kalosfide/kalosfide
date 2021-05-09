import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { FANomIcone } from '../../kf-partages/kf-icone-def';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../../kf-partages/kf-gere-css-style';
import { KfIconeTaille, KfIconeAnimation, KfIconeRotation, KfIconeSymétrie, KfIconePositionTexte } from './kf-icone-types';

export interface IKfAvecIconeSurvol {
    /**
     * Icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    iconeSurvol: KfIcone;
    /**
     * KfGéreCss de l'élément html qui contient l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    conteneurSurvolé: KfGéreCss;
    /**
     * Array des KfGéreCss des contenus (autre que l'icone) de l'élément html qui contient
     * l'icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    contenusSurvolés: KfGéreCss[];
    /**
     * Ajoute une icone que l'on peut montrer ou cacher à afficher par dessus le composant.
     */
    ajouteIconeSurvol(icone: KfIcone): void;
}

export interface IKfIcone {
    géreCss: KfGéreCss;
    nom: string;
    nomIcone: FANomIcone;
    texteCouche: string;
    largeurFixe: boolean;
    inverse: boolean;
    taille(valeur: KfIconeTaille): void;
    animation(type: KfIconeAnimation): void;
    rotation(valeur: KfIconeRotation): void;
    symétrie(nom: KfIconeSymétrie): void;
}

class KfIconeBase extends KfComposant implements IKfIcone {
    nomIcone: FANomIcone;
    texteCouche: string;
    private pTaille: string;
    private pAnimation: string;
    private pRotation: string;
    private pSymétrie: string;
    largeurFixe: boolean;
    inverse: boolean;

    tailleCouche: 1 | 2;

    taillePolicePourCent: number;

    constructor(nom: string, nomIcone?: FANomIcone) {
        super(nom, KfTypeDeComposant.icone);
        this.nomIcone = nomIcone;
    }

    get géreCss(): KfGéreCss {
        return this;
    }
    /**
     * retourne l'icone de l'element ou de son label si l'élément est équivalent à un label ou a un label
     */
    get icone(): FANomIcone {
        return this.nomIcone;
    }

    taille(valeur: KfIconeTaille) {
        this.pTaille = typeof (valeur) === 'string' ? valeur : '' + valeur + 'x';
    }

    animation(type: KfIconeAnimation) {
        this.pAnimation = type;
    }

    rotation(valeur: KfIconeRotation) {
        this.pRotation = 'rotate-' + valeur;
    }

    symétrie(nom: KfIconeSymétrie) {
        this.pSymétrie = 'flip-' + nom;
    }

    get faClasse(): string {
        const faClasse: string[] = [''];
        if (this.nomIcone) {
            let faNom: string;
            let faStyle = 'fas';
            if (typeof(this.nomIcone) === 'string') {
                faNom = this.nomIcone;
            } else {
                faNom = this.nomIcone.nom;
                faStyle = 'far';
            }
            faClasse.push(faStyle, 'fa-' + faNom);
        }
        if (this.pTaille) {
            faClasse.push('fa-' + this.pTaille);
        }
        if (this.pAnimation) {
            faClasse.push('fa-' + this.pAnimation);
        }
        if (this.inverse) {
            faClasse.push('fa-inverse');
        }
        if (this.largeurFixe) {
            faClasse.push('fa-fw');
        }
        if (this.pSymétrie) {
            faClasse.push('fa-' + this.pSymétrie);
        }
        if (this.pRotation) {
            faClasse.push('fa-' + this.pRotation);
        }
        if (this.tailleCouche) {
            faClasse.push('fa-stack-' + this.tailleCouche + 'x');
        }
        return faClasse.join(' ');
    }

}

export class KfIcone extends KfIconeBase {
    private pTexteDef: KfTexteDef;
    private pGéreCssTexte: KfGéreCss;
    private pPositionTexte: KfIconePositionTexte;

    private pCouches: IKfIcone[];
    private pTaillePile: string;

    private pGéreCssFond: KfGéreCss;

    private pAvecSurvol: IKfAvecIconeSurvol;

    constructor(nom: string, nomIcone?: FANomIcone) {
        super(nom, nomIcone);
    }

    ajouteTexte(texteDef: KfTexteDef, position?: KfIconePositionTexte) {
        this.pPositionTexte = position ? position : 'droite';
        this.pTexteDef = texteDef;
        if (this.pPositionTexte === 'haut' || this.pPositionTexte === 'bas' || this.pPositionTexte === 'dessus') {
            this.créegéreCssFond();
            this.géreCssFond.ajouteClasse('kf-texte-dans-icone-fond', 'kf-texte-dans-icone-' + this.pPositionTexte);
            this.créegéreCssTexte();
            this.géreCssTexte.ajouteClasse('kf-texte-dans-icone');
        }
    }

    get texteAvecCss(): boolean {
        return !!this.pGéreCssTexte;
    }

    get positionTexte(): KfIconePositionTexte {
        return this.pPositionTexte;
    }

    get texteDef(): KfTexteDef {
        return this.pTexteDef;
    }
    set texteDef(texteDef: KfTexteDef) {
        this.pTexteDef = texteDef;
    }

    get texte(): string {
        if (this.pTexteDef) {
            return ValeurTexteDef(this.pTexteDef);
        }
    }

    créegéreCssTexte() {
        this.pGéreCssTexte = new KfGéreCss();
    }

    get géreCssTexte(): KfGéreCss {
        return this.pGéreCssTexte;
    }

    get classeTexte(): KfNgClasse {
        if (this.pGéreCssTexte) {
            return this.pGéreCssTexte.classe;
        }
    }

    get styleTexte(): KfNgStyle {
        if (this.pGéreCssTexte) {
            return this.pGéreCssTexte.style;
        }
    }

    empile(nomBas: FANomIcone, tailleBas?: 1 | 2, nomHaut?: FANomIcone, tailleHaut?: 1 | 2): IKfIcone {
        this.nomIcone = nomBas;
        this.tailleCouche = tailleBas ? tailleBas : 1;
        this.pCouches = [this];
        let icone: KfIconeBase;
        if (nomHaut) {
            icone = new KfIconeBase('', nomHaut);
            icone.tailleCouche = tailleHaut ? tailleHaut : 1;
            this.pCouches = [this, icone];
        }
        return icone;
    }

    empileTexte(texte: string): IKfIcone {
        if (!this.pCouches) {
            if (this.nomIcone) {
                this.pCouches = [this];
            } else {
                this.pCouches = [];
            }
        }
        const icone = new KfIconeBase('');
        icone.texteCouche = texte;
        icone.tailleCouche = 1;
        this.pCouches.push(icone);
        return icone;
    }

    get couches(): IKfIcone[] {
        return this.pCouches;
    }

    taillePile(valeur: KfIconeTaille) {
        this.pTaillePile = typeof (valeur) === 'string' ? valeur : '' + valeur + 'x';
    }

    get faClassePile(): string {
        const faClasse: string[] = [''];
        faClasse.push('fa-stack');
        if (this.pTaillePile) {
            faClasse.push('fa-' + this.pTaillePile);
        }
        return faClasse.join(' ');
    }

    /**
     * Inclut l'élément i dans un élément span.
     */
    créegéreCssFond() {
        this.pGéreCssFond = new KfGéreCss();
    }

    /**
     * Gére classes et styles de l'élément span contenant l'élément i.
     */
    get géreCssFond(): KfGéreCss {
        return this.pGéreCssFond;
    }

    /**
     * Vrai si l'élément i est inclus dans un élément span.
     */
    get avecFond(): boolean {
        return !!this.pGéreCssFond;
    }

    /**
     * ngClass dans le template de l'élément span contenant l'élément i.
     */
    get classeFond(): KfNgClasse {
        if (this.pGéreCssFond) {
            return this.pGéreCssFond.classe;
        }
    }

    /**
     * ngStyle dans le template de l'élément span contenant l'élément i.
     */
    get styleFond(): KfNgStyle {
        if (this.pGéreCssFond) {
            return this.pGéreCssFond.style;
        }
    }

    survole(avecSurvol: IKfAvecIconeSurvol) {
        avecSurvol.ajouteIconeSurvol(this);
        avecSurvol.conteneurSurvolé.ajouteClasse('avec-survol');
        this.créegéreCssFond();
        this.géreCssFond.ajouteClasse('survol-centre', 'kf-invisible');
        this.pAvecSurvol = avecSurvol;
    }
    get attenteSurvol(): {
        commence: () => void,
        finit: () => void
    } {
        return  {
            commence: () => {
                this.pAvecSurvol.contenusSurvolés.forEach(s => s.ajouteClasse('avec-survol-actif'));
                this.géreCssFond.supprimeClasse('kf-invisible');
            },
            finit: () => {
                this.pAvecSurvol.contenusSurvolés.forEach(s => s.supprimeClasse('avec-survol-actif'));
                this.géreCssFond.ajouteClasse('kf-invisible');
            }
        };
    }

    /**
     * Visibilité de l'élément span contenant l'élément i.
     */
    get fondVisible(): boolean {
        if (this.pGéreCssFond) {
            return this.pGéreCssFond.visible;
        }
    }
    /**
     * Fixe la visibilité de l'élément span contenant l'élément i.
     */
    set fondVisible(visible: boolean) {
        if (this.pGéreCssFond) {
            this.pGéreCssFond.visible = visible;
        }
    }

}
