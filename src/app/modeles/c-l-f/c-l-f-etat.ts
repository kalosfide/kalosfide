import { KfOptionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-option-texte';
import { CLFLigne } from './c-l-f-ligne';

export enum IdEtatCLFLigne {
    tout = 'T',
    àPréparer = 'A',
    préparé = 'P',
    refusé = 'R',
}

class EtatCLFLigneDef {
    valeur: IdEtatCLFLigne;
    texte: string;
    vérifie: (commande: CLFLigne) => boolean;
}

const tout: EtatCLFLigneDef = {
    valeur: IdEtatCLFLigne.tout,
    texte: '',
    vérifie: (c: CLFLigne) => true
};

const àPréparer: EtatCLFLigneDef = {
    valeur: IdEtatCLFLigne.àPréparer,
    texte: 'à préparer',
    vérifie: (c: CLFLigne) => !c.préparé
};

const préparé: EtatCLFLigneDef = {
    valeur: IdEtatCLFLigne.préparé,
    texte: 'prêts',
    vérifie: (c: CLFLigne) => c.préparé
};

const refusé: EtatCLFLigneDef = {
    valeur: IdEtatCLFLigne.refusé,
    texte: 'refusés',
    vérifie: (c: CLFLigne) => c.annulé
};

export class EtatCLFLigne {

    static tout: EtatCLFLigneDef = {
        valeur: IdEtatCLFLigne.tout,
        texte: '',
        vérifie: (c: CLFLigne) => true
    };

    static àPréparer: EtatCLFLigneDef = {
        valeur: IdEtatCLFLigne.àPréparer,
        texte: 'à préparer',
        vérifie: (c: CLFLigne) => !c.préparé
    };

    static prêt: EtatCLFLigneDef = {
        valeur: IdEtatCLFLigne.préparé,
        texte: 'prêts',
        vérifie: (c: CLFLigne) => c.préparé
    };

    static refusé: EtatCLFLigneDef = {
        valeur: IdEtatCLFLigne.refusé,
        texte: 'refusés',
        vérifie: (c: CLFLigne) => c.annulé
    };

    static get liste(): EtatCLFLigneDef[] {
        return [tout, àPréparer, préparé, refusé];
    }

    static étatDeId(id: IdEtatCLFLigne): EtatCLFLigneDef {
        switch (id) {
            case IdEtatCLFLigne.tout:
                return tout;
            case IdEtatCLFLigne.àPréparer:
                return àPréparer;
            case IdEtatCLFLigne.préparé:
                return préparé;
            case IdEtatCLFLigne.refusé:
                return refusé;
            default:
                break;
        }
    }

    option(etat: EtatCLFLigneDef): KfOptionTexte {
        const option = new KfOptionTexte(etat.valeur);
        option.fixeTexte(etat.texte);
        return option;
    }
}
