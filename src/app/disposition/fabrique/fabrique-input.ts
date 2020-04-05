import { KfInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { DataService } from 'src/app/services/data.service';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { ResultatAction } from '../affiche-resultat/resultat-affichable';
import { KfEntrée } from 'src/app/commun/kf-composants/kf-composant/kf-entree';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import {
    KfListeDeroulanteTexte, KfListeDeroulanteNombre
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfListeDeroulanteObjet } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-objet';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { TypeCommande } from 'src/app/modeles/type-commande';

class FabriqueEntrée extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }
    protected prépareInput(input: KfEntrée) {
        input.géreClasseDiv.ajouteClasseDef('form-group row');
        input.géreClasseLabel.ajouteClasseDef('col-sm-2 col-form-label');
        input.géreClasseEntree.ajouteClasseDef({ nom: 'col-sm-10', active: () => !input.estDansVueTable });
        input.ajouteClasseDef('form-control',
            { nom: '.form-control-plaintext', active: () => input.lectureSeule }
        );
    }

    prépareSuitValeurEtFocus(input: KfEntrée, apiAction: ApiRequêteAction, service: DataService) {
        const icone = this.fabrique.icone.préparePourAttente(input.géreClasseEntree, apiAction);
        input.ajouteIconeSurvol(icone);
        input.gereHtml.suitValeurEtFocus(() => {
            return service.actionOkObs(apiAction);
        });
    }
}

export class FabriqueInput extends FabriqueEntrée {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    texte(nom: string, texte?: KfTexteDef, placeholder?: string): KfInputTexte {
        const input = new KfInputTexte(nom, texte);
        input.placeholder = placeholder;
        this.prépareInput(input);
        return input;
    }
    texteLectureSeule(nom: string, texte?: KfTexteDef, valeur?: string): KfInputTexte {
        const input = this.texte(nom, texte);
        input.valeur = valeur;
        input.lectureSeule = true;
        input.estRacineV = true;
        return input;
    }
    texteInvisible(nom: string, valeur?: string): KfInputTexte {
        const input = new KfInputTexte(nom);
        input.valeur = valeur;
        input.visible = false;
        return input;
    }
    nombre(nom: string, texte?: KfTexteDef, placeholder?: string): KfInputNombre {
        const input = new KfInputNombre(nom, texte);
        input.placeholder = placeholder;
        this.prépareInput(input);
        return input;
    }
    nombreInvisible(nom: string, valeur?: number): KfInputNombre {
        const input = new KfInputNombre(nom);
        input.valeur = valeur;
        input.visible = false;
        return input;
    }
    nombrePrix(nom: string, texte?: KfTexteDef, placeholder?: string): KfInputNombre {
        const input = this.nombre(nom, texte, placeholder);
        input.ajouteValidateur(KfValidateurs.nombreVirgule(7, 2, '>'));
        return input;
    }
    nombreUnités(nom: string, texte?: KfTexteDef, placeholder?: string): KfInputNombre {
        const input = this.nombre(nom, texte, placeholder);
        input.ajouteValidateur(KfValidateurs.nombreVirgule(8, 0, '>='));
        return input;
    }
    nombreQuantité(nom: string, typeCommande: () => string, texte?: KfTexteDef, placeholder?: string): KfInputNombre {
        const input = this.nombre(nom, texte, placeholder);
        input.min = 0;
        input.pas = typeCommande() === TypeCommande.id.ALUnité ? 1 : .001;
        input.ajouteValidateur(KfValidateurs.nombreVirgule(8, () => {
            const type = typeCommande();
            return type === TypeCommande.id.ALUnité ? 0 : 3;
        }, '>='));
        return input;
    }
}

export class FabriqueListeDéroulante extends FabriqueEntrée {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    // liste déroulante
    texte(nom: string, texte?: KfTexteDef): KfListeDeroulanteTexte {
        const liste = new KfListeDeroulanteTexte(nom, texte);
        this.prépareInput(liste);
        return liste;
    }
    nombre(nom: string, texte?: KfTexteDef): KfListeDeroulanteNombre {
        const liste = new KfListeDeroulanteNombre(nom, texte);
        this.prépareInput(liste);
        return liste;
    }
    objet<T>(nom: string, texte?: KfTexteDef): KfListeDeroulanteObjet<T> {
        const liste = new KfListeDeroulanteObjet<T>(nom, texte);
        this.prépareInput(liste);
        return liste;
    }
}

