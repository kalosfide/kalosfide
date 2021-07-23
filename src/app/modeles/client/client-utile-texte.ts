import { KfstringDef } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-textes';
import { Site } from "../site/site";

export class ClientUtileTexte {
    def(site: Site): ({
        client: KfstringDef,
    }) {
        return {
            client: 'Un client '
        };
    }
}