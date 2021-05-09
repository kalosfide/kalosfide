import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { NavBar } from './navbar';
import { NavItem } from './nav-item';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { KfNgClasse } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css-classe';
import { NavItemContenu } from './nav-item-contenu';

export class NavItemUlLi extends NavItem {
    private pGéreCss: KfGéreCss;
    private pItems: NavItemContenu[];

    constructor(nom: string, parent: NavBar) {
        super(nom, parent);
        this.pItems = [];
        this.pQuandChange = () => {
            this.pItems.forEach(item => item.quandChange());
        };
    }

    get composant(): KfComposant {
        return null;
    }

    get items(): NavItemContenu[] {
        return this.pItems;
    }

    get géreCss(): KfGéreCss {
        if (!this.pGéreCss) {
            this.pGéreCss = new KfGéreCss();
        }
        return this.pGéreCss;
    }

    get classe(): KfNgClasse {
        if (this.pGéreCss) {
            return this.pGéreCss.classe;
        }
    }

    get style(): KfNgClasse {
        if (this.pGéreCss) {
            return this.pGéreCss.style;
        }
    }

    fermeQuandClick() {
        this.pItems.forEach(i => i.fermeQuandClick());
    }

    ajoute(item: NavItemContenu) {
        this.pItems.push(item);
    }
}
