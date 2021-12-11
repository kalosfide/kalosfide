import { ItemCompte } from './item-compte';
import { ComptePages } from '../compte-pages';
import { NavItemDropDownGroup } from 'src/app/disposition/navbars/nav-item-dropdown-group';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class ItemMonCompte extends NavItemDropDownGroup {

    constructor(parent: ItemCompte) {
        super('monCompte', parent);

        this.rafraichit = () => {
            const contenus: NavItemLien[] = [];
            const routeur = Fabrique.url.appRouteur.compte;
            if (this.identifiant) {
                const changeMotDePasse = new NavItemLien(ComptePages.changeMotDePasse.path, this);
                changeMotDePasse.texte = ComptePages.changeMotDePasse.lien;
                changeMotDePasse.url = routeur.url(ComptePages.changeMotDePasse.path);
                contenus.push(changeMotDePasse);
                const changeEmail = new NavItemLien(ComptePages.changeEmail.path, this);
                changeEmail.texte = ComptePages.changeEmail.lien;
                changeEmail.url = routeur.url(ComptePages.changeEmail.path);
                contenus.push(changeEmail);

                if (!this.identifiant.estAdministrateur) {
                    const itemMonCompte = new NavItemLien(ComptePages.gestion.path, this);
                    itemMonCompte.texte = ComptePages.gestion.lien;
                    itemMonCompte.url = routeur.url(ComptePages.gestion.path);
                    contenus.push(itemMonCompte);
                }
            }
            this.fixeContenus(contenus);
        };
    }
}
