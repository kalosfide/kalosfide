import { KfComposant } from "../../kf-composant/kf-composant";
import { KfTypeDeComposant } from "../../kf-composants-types";
import { IKfAvecSurvol } from "./i-kf-avec-survol";
import { IKfSurvole } from "./i-kf-survole";

export class KfSurvol extends KfComposant {
    // pour le template
    survole: IKfSurvole;

    commence: () => void;
    finit: () => void;

    avecSurvolInactifPendantSurvol: boolean;

    constructor(avecSurvol: IKfAvecSurvol, survole: IKfSurvole, options?: {
        avecSurvolInactifPendantSurvol?: true,
    }) {
        super('', KfTypeDeComposant.aucun);
        this.survole = survole;
        avecSurvol.conteneurSurvolé.ajouteClasse('avec-survol');
        if (!survole.fond) {
            survole.créeFond();
        }
        survole.fond.ajouteClasse('survol-centre', 'kf-invisible');
        const commence = () => {
            avecSurvol.contenusSurvolés.forEach(s => s.ajouteClasse('avec-survol-actif'));
            survole.fond.supprimeClasse('kf-invisible');
        };
        const finit = () => {
            avecSurvol.contenusSurvolés.forEach(s => s.supprimeClasse('avec-survol-actif'));
            survole.fond.ajouteClasse('kf-invisible');
        }
        if (options?.avecSurvolInactifPendantSurvol) {
            survole.fond.gereHtml.fixeAttribut('tabindex', '0');
            let avecSurvolALeFocus: boolean;
            this.commence = () => {
                avecSurvolALeFocus = avecSurvol.gereHtml.aLeFocus;
                avecSurvol.inactivité = true;
                commence();
                if (avecSurvolALeFocus) {
                    survole.fond.gereHtml.prendLeFocus();
                }
            };
            this.finit = () => {
                avecSurvol.inactivité = false;
                finit();
                if (avecSurvolALeFocus) {
                    avecSurvol.gereHtml.prendLeFocus();
                }
            };
        } else {
            this.commence = commence;
            this.finit = finit;
        }
    }

}

