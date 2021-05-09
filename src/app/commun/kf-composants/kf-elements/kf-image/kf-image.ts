import { ValeurTexteDef } from '../../kf-partages/kf-texte-def';
import { ValeurNombreDef } from '../../kf-partages/kf-nombre-def';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfTypeDHTMLEvents } from '../../kf-partages/kf-evenements';
import { KfImageDef } from '../../kf-partages/kf-image-def';

export class KfImage extends KfComposant {
    imageDef: KfImageDef;

    constructor(nom: string, imageDef: KfImageDef, avecClic?: boolean) {
        super(nom, KfTypeDeComposant.image);
        this.imageDef = imageDef;
        if (avecClic) {
            this.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        }
    }

    get url(): string {
        return ValeurTexteDef(this.imageDef.urlDef);
    }

    get avecLargeur(): boolean {
        return this.imageDef.largeurDef !== undefined;
    }

    get largeur(): number {
        return ValeurNombreDef(this.imageDef.largeurDef);
    }

    get avecHauteur(): boolean {
        return this.imageDef.hauteurDef !== undefined;
    }

    get hauteur(): number {
        return ValeurNombreDef(this.imageDef.hauteurDef);
    }
}
