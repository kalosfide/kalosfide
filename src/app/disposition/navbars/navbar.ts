import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { NavItemLien } from './nav-item-lien';
import { NavItemDropdown } from './nav-item-dropdown';
import { NavItemUlLi } from './nav-item-ul-li';
import { NavItemFormulaire } from './nav-item-formulaire';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';

export class NavBar {

    site: Site;
    identifiant: Identifiant;

    nom: string;
    enTetes: (NavItemLien | NavItemDropdown)[];
    bascule: KfBouton;
    contenus: (NavItemUlLi | NavItemFormulaire)[];

    constructor(nom: string) {
        this.nom = nom;
    }

    // pour donner accès aux descendants
    get navBar(): NavBar {
        return this;
    }

    get idContenu(): string {
        return this.nom + '_contenu';
    }

    get idBascule(): string {
        return this.nom + '_bascule';
    }

    rafraichit() {
        this.enTetes.forEach(m => m.quandChange());
        this.contenus.forEach(i => i.quandChange());
    }

}
