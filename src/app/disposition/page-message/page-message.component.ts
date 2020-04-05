import { PageDef } from 'src/app/commun/page-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from '../fabrique/fabrique';

export abstract class PageMessageComponent {
    titrePage: KfGroupe;

    abstract pageDef: PageDef;
    abstract messages: string[];

    constructor() {
        this.titrePage = Fabrique.titrePage.titrePage(this.titre, 1);
    }

    get titre(): string {
        return this.pageDef.titre;
    }
}
