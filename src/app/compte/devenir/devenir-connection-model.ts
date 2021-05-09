import { KfInputTexte } from '../../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTypeDInput } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-type-d-input';

export class DevenirConnectionEditeur {
    kfTexteDuMotDePasse: KfInputTexte;

    constructor() {
    }

    créeContenus(): KfComposant[] {
        const champs: KfComposant[] = [];
        const userName = Fabrique.input.texte('userName', 'Identifiant');
        userName.typeDInput = KfTypeDInput.email;
        userName.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.autorise('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+'),
            KfValidateurs.validateur(
                'nomPris',
                null,
                'Il y a déjà un utilisateur enregistré avec cet identifiant.'
            )
        );
        userName.placeholder = 'ex: admin@kalosfide.fr';
        userName.texteAide = Fabrique.étiquetteAide(userName.nom,
            `L'identifiant ne peut contenir que des lettres minuscules ou majuscules sans accent, des chiffres et -._@+`);
        champs.push(userName);
        this.kfTexteDuMotDePasse = Fabrique.input.texte('password', 'Mot de passe');
        this.kfTexteDuMotDePasse.typeDInput = KfTypeDInput.password;
        this.kfTexteDuMotDePasse.ajouteValidateur(KfValidateurs.required);
        champs.push(this.kfTexteDuMotDePasse);
        const email = Fabrique.input.texte('email', 'Adresse mail');
        email.typeDInput = KfTypeDInput.email;
        email.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.email,
            KfValidateurs.validateur(
                'emailPris',
                null,
                'Il y a déjà un utilisateur enregistré avec cette adresse.'
            )
        );
        email.placeholder = 'ex: admin@kalosfide.fr';
        champs.push(email);
        return champs;
    }

}
