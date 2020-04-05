import { KfElement } from '../../kf-composant/kf-element';
import { KfTypeDeComposant, KfTypeDeBaliseHTML } from '../../kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { FANomIcone } from '../../kf-partages/kf-icone-def';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasseDef, KfNgClasse } from '../../kf-partages/kf-gere-css-classe';
import { KfNgStyle } from '../../kf-partages/kf-gere-css-style';
import { KfIconeTaille, KfIconeAnimation, KfIconeRotation, KfIconeSymétrie, KfIconePositionTexte } from './kf-icone-types';
import { KfTexte } from '../kf-texte/kf-texte';

export interface IKfIcone {
    géreCss: KfGéreCss;
    nom: string;
    nomIcone: FANomIcone;
    largeurFixe: boolean;
    inverse: boolean;
    taille(valeur: KfIconeTaille): void;
    animation(type: KfIconeAnimation): void;
    rotation(valeur: KfIconeRotation): void;
    symétrie(nom: KfIconeSymétrie): void;
}

class KfIconeBase extends KfElement implements IKfIcone {
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
            faClasse.push('fa');
            faClasse.push('fa-' + this.nomIcone);
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

    constructor(nom: string, nomIcone?: FANomIcone) {
        super(nom, nomIcone);
    }

    ajouteTexte(texteDef: KfTexteDef, position?: KfIconePositionTexte) {
        this.pPositionTexte = position ? position : 'droite';
        this.pTexteDef = texteDef;
        if (this.pPositionTexte === 'haut' || this.pPositionTexte === 'bas') {
            this.créegéreCssFond();
            this.géreCssFond.ajouteClasseDef('kf-texte-dans-icone-fond', 'kf-texte-dans-icone-' + this.pPositionTexte);
            this.créegéreCssTexte();
            this.géreCssTexte.ajouteClasseDef('kf-texte-dans-icone');
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

    créegéreCssFond() {
        this.pGéreCssFond = new KfGéreCss();
    }

    get géreCssFond(): KfGéreCss {
        return this.pGéreCssFond;
    }

    get avecFond(): boolean {
        return !!this.pGéreCssFond;
    }

    get classeFond(): KfNgClasse {
        if (this.pGéreCssFond) {
            return this.pGéreCssFond.classe;
        }
    }

    get styleFond(): KfNgStyle {
        if (this.pGéreCssFond) {
            return this.pGéreCssFond.style;
        }
    }

    get fondVisible(): boolean {
        if (this.pGéreCssFond) {
            return this.pGéreCssFond.visible;
        }
    }
    set fondVisible(visible: boolean) {
        if (!this.pGéreCssFond) {
            this.pGéreCssFond = new KfGéreCss();
        }
        this.pGéreCssFond.visible = visible;
    }

}
