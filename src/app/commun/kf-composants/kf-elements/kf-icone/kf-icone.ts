import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { IKfIconeDef } from '../../kf-partages/kf-icone-def';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../../kf-partages/kf-gere-css-style';
import { KfIconeTaille, KfIconeAnimation, KfIconeRotation, KfIconeSymétrie, KfIconePositionTexte } from './kf-icone-types';
import { IKfSurvole } from '../../kf-partages/kf-survol/i-kf-survole';
import { KfTexte } from '../kf-texte/kf-texte';

export interface IKfIcone {
    géreCss: KfGéreCss;
    nom: string;
    iconeDef: IKfIconeDef;
    texteCouche: string;
    largeurFixe: boolean;
    inverse: boolean;
    taille(valeur: KfIconeTaille): void;
    animation(type: KfIconeAnimation): void;
    rotation(valeur: KfIconeRotation): void;
    symétrie(nom: KfIconeSymétrie): void;
}

class KfIconeBase extends KfComposant implements IKfIcone {
    iconeDef: IKfIconeDef;
    texteCouche: string;
    private pTaille: string;
    private pAnimation: string;
    private pRotation: string;
    private pSymétrie: string;
    largeurFixe: boolean;
    inverse: boolean;

    tailleCouche: 1 | 2;

    constructor(nom: string, iconeDef?: IKfIconeDef) {
        super(nom, KfTypeDeComposant.icone);
        this.iconeDef = iconeDef;
    }

    get géreCss(): KfGéreCss {
        return this;
    }
    /**
     * retourne l'icone de l'element ou de son label si l'élément est équivalent à un label ou a un label
     */
    get icone(): IKfIconeDef {
        return this.iconeDef;
    }

    taille(valeur: KfIconeTaille) {
        if (valeur === 'sm') {
            // 'sm' est pour les BootstrapSpinners
            return;
        }
        this.pTaille = valeur === 'lg' ? valeur : '' + valeur + 'x';
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
        if (this.iconeDef) {
            faClasse.push(this.iconeDef.collection.classe, `${this.iconeDef.collection.préfixe}-${this.iconeDef.nom}`)
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

export class KfIcone extends KfIconeBase implements IKfSurvole {
    private pTexteDef: KfTexteDef;
    private pGéreCssTexte: KfGéreCss;
    private pPositionTexte: KfIconePositionTexte;

    private pCouches: IKfIcone[];
    private pTaillePile: string;

    /**
     * Composant de n'importe quel type pour accéder aux propriétés css et à l'élément html du fond
     */
     private pFond: KfComposant;

    constructor(nom: string, iconeDef?: IKfIconeDef) {
        super(nom, iconeDef);
    }

    ajouteTexte(texteDef: KfTexteDef, position?: KfIconePositionTexte) {
        this.pPositionTexte = position ? position : 'droite';
        this.pTexteDef = texteDef;
        if (this.pPositionTexte === 'haut' || this.pPositionTexte === 'bas' || this.pPositionTexte === 'dessus') {
            this.créeFond();
            this.fond.ajouteClasse('kf-texte-dans-icone-fond', 'kf-texte-dans-icone-' + this.pPositionTexte);
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

    empile(nomBas: IKfIconeDef, tailleBas?: 1 | 2, nomHaut?: IKfIconeDef, tailleHaut?: 1 | 2): IKfIcone {
        this.iconeDef = nomBas;
        this.tailleCouche = tailleBas ? tailleBas : 1;
        this.pCouches = [this];
        this.créeFond();
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
            if (this.iconeDef) {
                this.pCouches = [this];
            } else {
                this.pCouches = [];
            }
            this.créeFond();
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
    créeFond() {
        this.pFond = new KfTexte(`${this.nom}_fond`, '');
    }

    /**
     * Gére classes et styles de l'élément span contenant l'élément i.
     */
    get fond(): KfComposant {
        return this.pFond;
    }

    /**
     * Visibilité de l'élément span contenant l'élément i.
     */
    get fondVisible(): boolean {
        if (this.pFond) {
            return this.pFond.visible;
        }
    }
    /**
     * Fixe la visibilité de l'élément span contenant l'élément i.
     */
    set fondVisible(visible: boolean) {
        if (this.pFond) {
            this.pFond.visible = visible;
        }
    }

}
