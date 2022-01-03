import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-type-d-input';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { DataService } from 'src/app/services/data.service';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { KfEntrée } from 'src/app/commun/kf-composants/kf-elements/kf-entree/kf-entree';
import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import {
    KfListeDeroulanteTexte, KfListeDeroulanteNombre, KfListeDeroulanteBool
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfListeDeroulanteObjet } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-objet';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { TypeCommande, TypeCommandeFabrique } from 'src/app/modeles/type-commande';
import { ReglesDeMotDePasse } from 'src/app/securite/mot-de-passe';
import { IKfEntreeFocusClavier } from 'src/app/commun/kf-composants/kf-elements/kf-entree/i-kf-entree-focus-clavier';
import { KfRadios } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { KfRadio } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radio';
import { KfInputDateTemps } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-date-temps';

class FabriqueEntrée extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    prépareSuitValeurEtFocus(entrée: KfEntrée, apiAction: ApiRequêteAction, service: DataService) {
        const icone = this.fabrique.icone.iconeAttente();
        entrée.créeSurvol(icone);
        apiAction.attente = {
            commence: entrée.survol.commence,
            finit: entrée.survol.finit
        };

        const def: IKfEntreeFocusClavier = {
            /*
            sauveQuandPerdFocus: true,
            */
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

    texte(nom: string, texte?: KfStringDef, placeholder?: string): KfInputTexte {
        const input = new KfInputTexte(nom, texte);
        input.placeholder = placeholder;
        input.enlèveEspaces = true;
        return input;
    }
    texteLectureSeule(nom: string, texte?: KfStringDef, valeur?: string): KfInputTexte {
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
    email(nom?: string, texte?: KfStringDef): KfInputTexte {
        const input = this.texte(!nom ? 'email' : nom, !texte ? 'Adresse email' : texte, 'nom@kalosfide.fr');
        input.typeDInput = KfTypeDInput.email;
        input.ajouteValidateur(KfValidateurs.required, KfValidateurs.email);
        return input;
    }
    motDePasse(règlesDeMotDePasse: ReglesDeMotDePasse, nom?: string, texte?: KfStringDef): KfInputTexte {
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
        input.ajouteMontreMotDePasse(this.fabrique.icone.def.oeil, this.fabrique.icone.def.oeil_barré);
        return input;
    }
    nombre(nom: string, texte?: KfStringDef, placeholder?: string): KfInputNombre {
        const input = new KfInputNombre(nom, texte);
        input.placeholder = placeholder;
        return input;
    }
    nombreLectureSeule(nom: string, texte?: KfStringDef, valeur?: number): KfInputNombre {
        const input = this.nombre(nom, texte);
        input.valeur = valeur;
        input.lectureSeule = true;
        input.estRacineV = true;
        return input;
    }
    nombreInvisible(nom: string, valeur?: number): KfInputNombre {
        const input = new KfInputNombre(nom);
        input.valeur = valeur;
        input.visible = false;
        return input;
    }
    nombreQuantité(nom: string, typeCommande: () => TypeCommande, texte?: KfStringDef, placeholder?: string): KfInputNombre {
        const input = this.nombre(nom, texte, placeholder);
        input.min = 0;
        input.pas = typeCommande() === TypeCommande.ALUnité ? 1 : .001;
        input.ajouteValidateur(KfValidateurs.nombreVirgule(8, () => {
            const type = typeCommande();
            return type === TypeCommande.ALUnité ? 0 : 3;
        }, '>='));
        return input;
    }
    date(nom: string, texte?: KfStringDef, placeholder?: string): KfInputDateTemps {
        const input = new KfInputDateTemps(nom, texte);
        input.placeholder = placeholder;
        return input;
    }
    dateInvisible(nom: string, valeur?: Date): KfInputDateTemps {
        const input = new KfInputDateTemps(nom);
        input.valeur = valeur;
        input.visible = false;
        return input;
    }
}

export class FabriqueListeDéroulante extends FabriqueEntrée {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    // liste déroulante
    texte(nom: string, texte?: KfStringDef): KfListeDeroulanteTexte {
        const liste = new KfListeDeroulanteTexte(nom, texte);
        return liste;
    }
    nombre(nom: string, texte?: KfStringDef): KfListeDeroulanteNombre {
        const liste = new KfListeDeroulanteNombre(nom, texte);
        return liste;
    }
    bool(nom: string, texte?: KfStringDef): KfListeDeroulanteBool {
        const liste = new KfListeDeroulanteBool(nom, texte);
        return liste;
    }
    objet<T>(nom: string, texte?: KfStringDef): KfListeDeroulanteObjet<T> {
        const liste = new KfListeDeroulanteObjet<T>(nom, texte);
        return liste;
    }
}

export class FabriqueRadios extends FabriqueEntrée {
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    // liste déroulante
    groupe(nom: string, texte?: KfStringDef): KfRadios {
        const radios = new KfRadios(nom, texte);
        return radios;
    }
    radio(nom: string, valeur: string, texte?: KfStringDef): KfRadio {
        const radio = new KfRadio(nom, valeur, texte);
        return radio;
    }
}
