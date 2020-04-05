import { KfNgClasseDefDe } from '../commun/kf-composants/kf-partages/kf-gere-css-classe';

export class EtatDef<T> {
    texte: string;
    classe: string;
    condition: (t: T) => boolean;

    static classeDef<T>(etat: EtatDef<T>): KfNgClasseDefDe<T> {
        const ngc: KfNgClasseDefDe<T> = {
            nom: etat.classe,
            active: etat.condition
        };
        return ngc;
    }
}

