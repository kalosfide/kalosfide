import { AppSite } from 'src/app/app-site/app-site';
import { ItemCompte } from 'src/app/compte/menu/item-compte';
import { KfImageDef } from 'src/app/commun/kf-composants/kf-partages/kf-image-def';
import { NavBar } from '../navbars/navbar';
import { NavItemLien } from '../navbars/nav-item-lien';
import { NavItemUlLi } from '../navbars/nav-item-ul-li';
import { NavItemDropdown } from '../navbars/nav-item-dropdown';
import { Fabrique } from '../fabrique/fabrique';

export abstract class Menu extends NavBar {

    marqueImage: NavItemLien;
    marqueTexte: NavItemLien;

    itemsAction: NavItemUlLi;

    compte: NavItemDropdown;

    constructor(nom: string) {
        super(nom);
    }

    protected abstract créeMarqueTexte(): NavItemLien;
    protected abstract créeItemsAction(): (NavItemLien | NavItemDropdown)[];

    get menu(): Menu {
        return this;
    }

    protected créeMarqueImage(): NavItemLien {
        const i = new NavItemLien('imageMarque', this);
        const imageDef: KfImageDef = {
            urlDef: () => Fabrique.url.appRouteur.image.url(this.site ? AppSite.imageInactif : AppSite.imageActif),
            largeurDef: AppSite.côtéImage,
            hauteurDef: AppSite.côtéImage
        };
        i.image = imageDef;
        i.url = Fabrique.url.appRouteur.url();
        i.lien.ajouteClasse('navbar-brand');
        return i;
    }

    protected créeItemCompte(): NavItemDropdown {
        return new ItemCompte(this);
    }

    créeItems() {
        this.marqueImage = this.créeMarqueImage();
        this.marqueTexte = this.créeMarqueTexte();
        this.enTetes = [this.marqueImage, this.marqueTexte];
        this.itemsAction = new NavItemUlLi('actions', this);
        this.itemsAction.géreCss.ajouteClasse('mr-auto');
        this.créeItemsAction().forEach(i => {
            this.itemsAction.ajoute(i);
        });
        this.itemsAction.fermeQuandClick();
        this.compte = this.créeItemCompte();
        const groupeCompte = new NavItemUlLi('compte', this);
        groupeCompte.géreCss.ajouteClasse('ms-auto');
        groupeCompte.ajoute(this.compte);
        this.contenus = [this.itemsAction, groupeCompte];
    }

}
