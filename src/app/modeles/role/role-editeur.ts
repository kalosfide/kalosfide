import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { IRoleData, Role } from './role';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

export class RoleEditeur extends KeyUidRnoEditeur<Role> {
    texteEtat: KfInputTexte;

    kfNom: KfInputTexte;
    kfAdresse: KfInputTexte;
    kfTexteEtat: KfInputTexte;
    usager: 'client' | 'fournisseur';

    constructor(component: IDataComponent, usager: 'client' | 'fournisseur') {
        super(component);
        this.usager = usager;
        this.keyAuto = true;
    }

    ajouteAideNom(): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        étiquette.ajouteTextes(
            `Le nom du ${this.usager} est utilisé dans l'en-tête des documents.`
        );
        this.kfDeData.push(étiquette);
        return étiquette;
    }

    ajouteAideAdresse(): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        étiquette.ajouteTextes(
            `L'adresse du ${this.usager} est utilisée dans l'en-tête des documents.`
        );
        this.kfDeData.push(étiquette);
        return étiquette;
    }

    créeNom(): KfInputTexte {
        const texte = `Nom du ${this.usager}`;
        this.kfNom = Fabrique.input.texte('nom', texte);
        this.kfNom.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            KfValidateurs.trim,
        );
        return this.kfNom;
    }
    créeAdresse(): KfInputTexte {
        this.kfAdresse = Fabrique.input.texte('adresse', 'Adresse');
        this.kfAdresse.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            KfValidateurs.trim,
        );
        return this.kfAdresse;
    }

    créeKfDeData() {
        this.kfDeData = [
            this.créeNom(),
            this.créeAdresse()
        ];
        Fabrique.formulaire.préparePourPage(this.kfDeData);
    }

    fixeValeur(irole: IRoleData) {
        this.kfNom.valeur = irole.nom;
        this.kfAdresse.valeur = irole.adresse;
    }
}
