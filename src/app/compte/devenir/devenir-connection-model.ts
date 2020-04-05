import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfInputTexte } from '../../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input';
import { EtapeDeFormulaireEditeur } from 'src/app/disposition/formulaire/etape-de-formulaire';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export class DevenirConnectionModel {
    email: string;
    password: string;
}

export class DevenirConnectionEditeur implements EtapeDeFormulaireEditeur {
    kfTexteDuMotDePasse: KfInputTexte;

    constructor() {
    }

    créeContenus(): KfComposant[] {
        const champs: KfComposant[] = [];
        const email = Fabrique.input.texte('email', 'Adresse mail');
        email.typeDInput = KfTypeDInput.email;
        email.ajouteValidateur(KfValidateurs.required);
        email.ajouteValidateur(KfValidateurs.email);
        email.ajouteValidateur(KfValidateurs.validateur(
            'emailPris',
            null,
            'Il y a déjà un utilisateur enregistré avec cette adresse'
        ));
        email.placeholder = 'ex: admin@kalosfide.fr';
        champs.push(email);
        this.kfTexteDuMotDePasse = Fabrique.input.texte('password', 'Mot de passe');
        this.kfTexteDuMotDePasse.typeDInput = KfTypeDInput.password;
        this.kfTexteDuMotDePasse.ajouteValidateur(KfValidateurs.required);
        champs.push(this.kfTexteDuMotDePasse);
        const confirme = Fabrique.input.texte('confirme', 'Confirmation du mot de passe');
        confirme.typeDInput = KfTypeDInput.password;
        confirme.ajouteValidateur(KfValidateurs.required);
        const validateur = KfValidateurs.aLaValeurDeComposant(this.kfTexteDuMotDePasse);
        validateur.message = 'La confirmation ne correspond pas au mot de passe.';
        confirme.ajouteValidateur(validateur);
        champs.push(confirme);
        return champs;
    }

}
