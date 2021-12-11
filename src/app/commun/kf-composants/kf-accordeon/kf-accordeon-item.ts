import { KfComposant } from "../kf-composant/kf-composant";
import { KfBouton } from "../kf-elements/kf-bouton/kf-bouton";
import { KfEvenement, KfStatutDEvenement, KfTypeDEvenement, KfTypeDHTMLEvents } from "../kf-partages/kf-evenements";
import { KfGéreCss } from "../kf-partages/kf-gere-css";
import { KfNgClasse } from "../kf-partages/kf-gere-css-classe";
import { KfNgStyle } from "../kf-partages/kf-gere-css-style";
import { IKfAccordeonClasse, KfAccordeon } from "./kf-accordeon";

export class KfAccordeonItem extends KfGéreCss {
    accordéon: KfAccordeon;
    no: number;
    bouton: KfBouton;
    contenus: KfComposant[];

    ouvert: boolean;

    private pGereCssEnTete: KfGéreCss;
    private pGereCssFermable: KfGéreCss;
    private pGereCssCorps: KfGéreCss;

    constructor(parent: KfAccordeon, no: number, bouton: KfBouton, contenus: KfComposant[]) {
        super();
        this.accordéon = parent;
        this.no = no;
        this.bouton = bouton;
        this.contenus = contenus;
        this.pGereCssEnTete = new KfGéreCss();
        this.pGereCssFermable = new KfGéreCss();
        this.pGereCssCorps = new KfGéreCss();
        const classe: IKfAccordeonClasse = parent.def.classe;
        this.ajouteClasse(classe.item);
        this.pGereCssEnTete.ajouteClasse(classe.enTête);
        bouton.ajouteClasse(classe.bouton, { nom: classe.boutonFermé, active: () => !this.ouvert });
        this.pGereCssFermable.ajouteClasse(classe.fermable, { nom: classe.fermableOuvert, active: () => this.ouvert });
        bouton.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.click, (événement: KfEvenement) => {
            parent.quandClic(no);
            événement.statut = KfStatutDEvenement.fini;
        });
    }

    get ariaExpanded(): string {
        return this.ouvert ? 'true' : 'false'
    }

    get nomEnTete(): string {
        return (this.accordéon.nom + 'EnTete' + this.no);
    }

    get nomFermable(): string {
        return (this.accordéon.nom + 'Fermable' + this.no);
    }

    get gereCssEnTete(): KfGéreCss {
        return this.pGereCssEnTete;
    }

    get classeEnTete(): KfNgClasse {
        return this.pGereCssEnTete.classe;
    }

    get gereCssCorps(): KfGéreCss {
        return this.pGereCssCorps;
    }

    get classeFermable(): KfNgClasse {
        return this.pGereCssFermable.classe;
    }

    get classeCorps(): KfNgClasse {
        return this.pGereCssCorps.classe;
    }

    get styleCorps(): KfNgStyle {
        if (this.pGereCssCorps) {
            return this.pGereCssCorps.style;
        }
    }
}