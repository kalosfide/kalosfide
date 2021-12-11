import { ItemCompte } from './item-compte';
import { ComptePages } from '../compte-pages';
import { PageDef } from 'src/app/commun/page-def';
import { NavItemLien } from 'src/app/disposition/navbars/nav-item-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class ItemConnection extends NavItemLien {
    constructor(parent: ItemCompte) {
        super(ComptePages.connection.path, parent);
        this.rafraichit = () => {
            const pageDef: PageDef = this.identifiant ? ComptePages.deconnection : ComptePages.connection;
            this.texte = pageDef.lien;
            this.url = Fabrique.url.appRouteur.compte.url(pageDef.path);
        };
    }
}
