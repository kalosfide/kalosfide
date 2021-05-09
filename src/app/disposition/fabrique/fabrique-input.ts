import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-type-d-input';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { DataService } from 'src/app/services/data.service';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { KfEntrée } from 'src/app/commun/kf-composants/kf-elements/kf-entree/kf-entree';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import {
    KfListeDeroulanteTexte, KfListeDeroulanteNombre
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfListeDeroulanteObjet } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-objet';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { TypeCommande } from 'src/app/modeles/type-commande';
import { ReglesDeMotDePasse } from 'src/app/securite/mot-de-passe';
import { IKfEntreeFocusClavier } from 'src/app/commun/kf-composants/kf-elements/kf-entree/i-kf-entree-focus-clavier';
import { KfRadios } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { IKfBootstrapOptions, KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { KfRadio } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radio';

class FabriqueEntrée extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    prépareSuitValeurEtFocus(entrée: KfEntrée, apiAction: ApiRequêteAction, service: DataService) {
        const icone = this.fabrique.icone.iconeAttente();
        icone.survole(entrée);
        apiAction.attente = icone.attenteSurvol;

        const def: IKfEntreeFocusClavier = {
            /*
            lectureSeuleSiPasFocus: true,
            sauveQuandPerdFocus: true,
            toucheRétablit: 'Escape',
            */
            toucheDébutEdition: 'F2',
            toucheRétablit: 'Escape',
            toucheSauvegarde: 'Enter',
            sauvegarde: () => service.actionObs(apiAction)
        };
        entrée.prépareFocusClavier(def);
    }
}

export class FabriqueInput extends FabriqueEntrée {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    texte(nom: string, texte?: KfTexteDef, placeholder?: string): KfInputTexte {
        const input = new KfInputTexte(nom, texte);
        input.placeholder = placeholder;
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
    email(nom?: string, texte?: KfTexteDef): KfInputTexte {
        const input = this.texte(!nom ? 'email' : nom, !texte ? 'Adresse email' : texte, 'nom@kalosfide.fr');
        input.typeDInput = KfTypeDInput.email;
        input.ajouteValidateur(KfValidateurs.required, KfValidateurs.email);
        return input;
    }
    motDePasse(règlesDeMotDePasse: ReglesDeMotDePasse, nom?: string, texte?: KfTexteDef): KfInputTexte {
        const input = this.texte(!nom ? 'password' : nom, !texte ? 'Mot de passe' : texte, 'Mot de passe');
        input.typeDInput = KfTypeDInput.password;
        input.ajouteValidateur(KfValidateurs.required);
        if (règlesDeMotDePasse) {
            if (règlesDeMotDePasse.noSpaces) {
                input.ajouteValidateur(KfValidateurs.noSpaces);
            }
            if (règlesDeMotDePasse.requiredLength) {
                input.ajouteValidateur(KfValidateurs.requiredLength(règlesDeMotDePasse.requiredLength));
            }
            if (règlesDeMotDePasse.requireDigit) {
                input.ajouteValidateur(KfValidateurs.requireDigit);
            }
            if (règlesDeMotDePasse.requireLowercase) {
                input.ajouteValidateur(KfValidateurs.requireLowercase);
            }
            if (règlesDeMotDePasse.requireUppercase) {
                input.ajouteValidateur(KfValidateurs.requireUppercase);
            }
            if (règlesDeMotDePasse.requireNonAlphanumeric) {
                input.ajouteValidateur(KfValidateurs.requireNonAlphanumeric);
            }
        }
        input.ajouteMontreMotDePasse('eye', 'eye-slash');
        return input;
    }
    nombre(nom: string, texte?: KfTexteDef, placeholder?: string): KfInputNombre {
        const input = new KfInputNombre(nom, texte);
        input.placeholder = placeholder;
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
        return liste;
    }
    nombre(nom: string, texte?: KfTexteDef): KfListeDeroulanteNombre {
        const liste = new KfListeDeroulanteNombre(nom, texte);
        return liste;
    }
    objet<T>(nom: string, texte?: KfTexteDef): KfListeDeroulanteObjet<T> {
        const liste = new KfListeDeroulanteObjet<T>(nom, texte);
        return liste;
    }
}

export class FabriqueRadios extends FabriqueEntrée {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    // liste déroulante
    groupe(nom: string, texte?: KfTexteDef): KfRadios {
        const radios = new KfRadios(nom, texte);
        return radios;
    }
    radio(nom: string, valeur: string, texte?: KfTexteDef): KfRadio {
        const radio = new KfRadio(nom, valeur, texte);
        return radio;
    }
}
