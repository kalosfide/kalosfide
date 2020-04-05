import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { ReglesDeMotDePasse } from 'src/app/securite/mot-de-passe/mot-de-passe';
import { EtapeDeFormulaireEditeur } from 'src/app/disposition/formulaire/etape-de-formulaire';

export class Utilisateur implements EtapeDeFormulaireEditeur {
    userName: string;
    password: string;
    persistant: boolean;

    kfMotDePasse: KfInputTexte;

    créeEMail(): KfInputTexte {
        const email = Fabrique.input.texte('email', 'Adresse mail');
        email.typeDInput = KfTypeDInput.email;
        email.ajouteValidateur(KfValidateurs.required);
        email.ajouteValidateur(KfValidateurs.email);
        return email;
    }

    private _créeMotDePasse(): KfInputTexte {
        const motDePasse = Fabrique.input.texte('password', 'Mot de passe');
        motDePasse.typeDInput = KfTypeDInput.password;
        motDePasse.ajouteValidateur(KfValidateurs.required);
        return motDePasse;
    }

    créeMotDePasse(): KfInputTexte {
        const motDePasse = this._créeMotDePasse();
        return motDePasse;
    }

    créeConfirmeMotDePasse(): KfInputTexte {
        const motDePasse = this._créeMotDePasse();
        const validateur = KfValidateurs.aLaValeurDeComposant(this.kfMotDePasse);
        validateur.message = 'La confirmation ne correspond pas au mot de passe.';
        motDePasse.ajouteValidateur(validateur);
        return motDePasse;
    }

    créePersistant(): KfCaseACocher {
        const persistant = Fabrique.caseACocher('persistant', 'Rester connecté');
        persistant.valeur = false;
        return persistant;
    }

    créeContenus(): KfComposant[] {
        const email = this.créeEMail();
        email.ajouteValidateur(KfValidateurs.validateur(
            'emailPris',
            null,
            'Il y a déjà un utilisateur enregistré avec cette adresse'
        ));
        email.placeholder = 'ex: admin@kalosfide.fr';

        this.kfMotDePasse = this.créeMotDePasse();
        const confirme = this.créeConfirmeMotDePasse();
        return [email, this.kfMotDePasse, confirme];
    }
    fixeRèglesMotDePasse(règles: ReglesDeMotDePasse) {
        this.kfMotDePasse.gereValeur.FixeValidateurs(ReglesDeMotDePasse.créeValidateurs(règles));
    }

    créeEdition(): KfGroupe {
        const groupe = Fabrique.formulaire.groupeEdition('donnees');
        const nom = Fabrique.input.texte('userName', 'Nom');
        groupe.ajoute(nom);

        groupe.ajoute(this.créeMotDePasse());
        groupe.ajoute(this.créePersistant());

        return groupe;
    }
}
