import { KfGéreCss } from '../../kf-partages/kf-gere-css';
import { KfNgClasseDef } from '../../kf-partages/kf-gere-css-classe';
import { FANomIcone } from '../../kf-partages/kf-icone-def';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
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

    constructor(nom: string, nomIcone: FANomIcone) {
        this.icone = new KfIcone(nom, nomIcone);
        this.icone.largeurFixe = true;
        this.icone.ajouteClasse('kf-input-icone');
        this.quandClic = () => { return; };
        this.quandEnfonce = () => { return; };
        this.quandRelache = () => { return; };
    }
}

export class KfInputTexte extends KfInput {
    typeDInput: KfTypeDInput;

    /**
     * Icones placées dans l'input ayant un role de bouton qui change la valeur ou l'aspect de l'input
     */
    iconesBoutons: IconeBouton[];

    /**
     * Si présent, gére classes et style d'un élément div contenant l'input et ses icones boutons.
     */
    cssDivBouton: KfGéreCss;

    constructor(nom: string, texte?: KfTexteDef) {
        super(nom, texte);
        this.typeDInput = KfTypeDInput.texte;
    }

    get valeur(): string {
        return this.litValeur() as string;
    }
    set valeur(valeur: string) {
        this.fixeValeur(valeur);
    }

    /**
     * Ajoute des classes à un élément div contenant l'input et ses icones boutons.
     */
    ajouteCssDivBouton(...classeDefs: (KfTexteDef | KfNgClasseDef)[]): void {
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
     * @param nomIcone icone à afficher
     */
    ajouteEffaceur(nomIcone: FANomIcone) {
        const iconeBouton = new IconeBouton('c', nomIcone);
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
     * @param nomIcone icone à afficher
     * @param input input à copier
     * @param transforme fonction de transformation
     */
    ajouteCopieur(nomIcone: FANomIcone, input: KfInputTexte, transforme?: (valeur: any) => any) {
        const iconeBouton = new IconeBouton('montreMotDePasse', nomIcone);
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
    ajouteMontreMotDePasse(iconeMontre: FANomIcone, iconeCache?: FANomIcone) {
        const iconeBouton = new IconeBouton('montreMotDePasse', iconeMontre);
        iconeBouton.quandEnfonce = () => {
            this.typeDInput = KfTypeDInput.texte;
            if (iconeCache) {
                iconeBouton.icone.nomIcone = iconeCache;
            }
        };
        iconeBouton.quandRelache = () => {
            this.typeDInput = KfTypeDInput.password;
            if (iconeCache) {
                iconeBouton.icone.nomIcone = iconeMontre;
            }
        };
        this.iconesBoutons = [iconeBouton];
    }

}
