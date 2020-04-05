import { Menu } from '../../disposition/menu/menu';
import { ItemConnection } from './item-connection';
import { ItemMesSites } from './item-mes-sites';
import { ItemMonCompte } from './item-mon-compte';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { NavItemDropdown } from 'src/app/disposition/navbars/nav-item-dropdown';

export class ItemCompte extends NavItemDropdown {

    constructor(parent: Menu) {
        super('compte', parent);
        this.dropdown.estADroiteDansMenu = true;
        this.dropdown.bouton.ajouteClasseDef('btn btn-sm btn-light');

        this.ajoute(new ItemConnection(this));
        this.ajoute(new ItemMesSites(this));
        this.ajoute(new ItemMonCompte(this));

        const anonyme = Fabrique.icone.iconeConnection();
        const identifié = Fabrique.icone.iconeConnecté();

        this.rafraichit = () => {
            if (this.identifiant) {
                this.contenuPhrase.contenus = [identifié];
            } else {
                this.contenuPhrase.contenus = [anonyme];
            }
        };
    }

}
