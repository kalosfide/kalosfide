import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

export class NavDef {
    route: any;
    titre: KfEtiquette;

    active: boolean;
    disabled: boolean;

    bouton: KfBouton;

    constructor(route: any, titre: KfEtiquette) {
        this.route = route;
        this.titre = titre;
    }
}
