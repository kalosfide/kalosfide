import { ItemCompte } from './item-compte';
import { ComptePages } from '../compte-pages';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class ItemAjoute extends NavItemLien {
    constructor(parent: ItemCompte) {
        super(ComptePages.ajoute.path, parent);
        this.texte = ComptePages.ajoute.lien;
        this.url = Fabrique.url.appRouteur.compte.url(ComptePages.ajoute.path);
        this.rafraichit = () => {
            this.pComposant.visible = !this.identifiant;
        };
    }
}
