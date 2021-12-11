import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasseDef } from '../../kf-partages/kf-gere-css-classe';
import { IKfIconeDef } from '../../kf-partages/kf-icone-def';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfIcone } from '../kf-icone/kf-icone';
import { KfInput } from './kf-input';
import { KfTypeDInput } from './kf-type-d-input';

/**
 * Icone placée dans l'input ayant un role de bouton qui change la valeur ou l'aspect de l'input
 */
class IconeBouton {
    icone: KfIcone;
    quandClic?: () => void;
    quandEnfonce?: () => void;
    quandRelache?: () => void;

    constructor(nom: string, iconeDef: IKfIconeDef) {
        this.icone = new KfIcone(nom, iconeDef);
        this.icone.largeurFixe = true;
        this.quandClic = () => { return; };
        this.quandEnfonce = () => { return; };
        this.quandRelache = () => { return; };
    }
}

export class KfInputTexte extends KfInput {
    typeDInput: KfTypeDInput;

    private pEnlèveEspaces: boolean;

    /**
     * Icones placées dans l'input ayant un role de bouton qui change la valeur ou l'aspect de l'input
     */
    iconesBoutons: IconeBouton[];

    /**
     * Si présent, gére classes et style d'un élément div contenant l'input et ses icones boutons.
     */
    cssDivBouton: KfGéreCss;

    constructor(nom: string, texte?: KfStringDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.texte;
    }

    /**
     * Si vrai les espaces au début et à la fin de la valeur sont supprimés et les suites d'espaces remplacées par un seul.
     */
    public get enlèveEspaces(): boolean {
        return this.pEnlèveEspaces;
    }
    public set enlèveEspaces(value: boolean) {
        this.pEnlèveEspaces = value;
    }

    get valeur(): string {
        const valeur = this.litValeur() as string;
        return this.pEnlèveEspaces ? TexteOutils.enlèveEspaces(valeur) : valeur;
    }
    set valeur(valeur: string) {
        this.fixeValeur(this.pEnlèveEspaces ? TexteOutils.enlèveEspaces(valeur) : valeur);
    }

    /**
     * Ajoute des classes à un élément div contenant l'input et ses icones boutons.
     */
    ajouteCssDivBouton(...classeDefs: (KfStringDef | KfNgClasseDef)[]): void {
        if (!this.cssDivBouton) {
            this.cssDivBouton = new KfGéreCss();
        }
        this.cssDivBouton.ajouteClasse(...classeDefs);
    }

    private ajouteIconeBouton(iconeBouton: IconeBouton) {
        if (!this.iconesBoutons) {
            this.iconesBoutons = [];
        }
        this.iconesBoutons.push(iconeBouton);
    }

    /**
     * Ajoute après l'input un span contenant une icone qui quand on le clique efface la valeur de l'input.
     * @param iconeDef icone à afficher
     */
    ajouteEffaceur(iconeDef: IKfIconeDef) {
        const iconeBouton = new IconeBouton('c', iconeDef);
        iconeBouton.icone.ajouteClasse(
            { nom: 'kf-invisible', active: (() => this.estVide).bind(this) }
        );
        iconeBouton.quandClic = () => {
            this.fixeValeur(null);
        };
        this.ajouteIconeBouton(iconeBouton);
    }

    /**
     * Ajoute après l'input un span contenant une icone qui quand on le clique copie dans la valeur de l'input
     * la valeur d'un autre input éventuellement transformée par une fonction.
     * @param iconeDef icone à afficher
     * @param input input à copier
     * @param transforme fonction de transformation
     */
    ajouteCopieur(iconeDef: IKfIconeDef, input: KfInputTexte, transforme?: (valeur: any) => any) {
        const iconeBouton = new IconeBouton('montreMotDePasse', iconeDef);
        iconeBouton.icone.ajouteClasse(
            { nom: 'kf-invisible', active: (() => !this.estVide || input.estVide).bind(this) }
        );
        iconeBouton.quandClic = () => {
            let valeur = input.litValeur();
            if (transforme) {
                valeur = transforme(valeur);
            }
            this.fixeValeur(valeur);
        };
        this.ajouteIconeBouton(iconeBouton);
    }

    /**
     * Ajoute après l'input un span contenant une icone qui réagit à l'enfoncement et au relachement du bouton
     * de la souris en changeant le type d'input de password à text et inversement.
     * @param iconeMontre icone à afficher (sauf pendant le clic si il y a deux icones)
     * @param iconeCache icone à afficher pendant le clic si présent
     */
    ajouteMontreMotDePasse(iconeMontre: IKfIconeDef, iconeCache?: IKfIconeDef) {
        const iconeBouton = new IconeBouton('montreMotDePasse', iconeMontre);
        iconeBouton.icone.ajouteClasse(
            { nom: 'kf-invisible', active: (() => this.estVide).bind(this) }
        );
        iconeBouton.quandEnfonce = () => {
            this.typeDInput = KfTypeDInput.texte;
            if (iconeCache) {
                iconeBouton.icone.iconeDef = iconeCache;
            }
        };
        iconeBouton.quandRelache = () => {
            this.typeDInput = KfTypeDInput.password;
            if (iconeCache) {
                iconeBouton.icone.iconeDef = iconeMontre;
            }
        };
        this.iconesBoutons = [iconeBouton];
    }

}
