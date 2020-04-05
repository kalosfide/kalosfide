import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { EtapeDeFormulaireEditeur } from '../disposition/formulaire/etape-de-formulaire';
import { Fabrique } from '../disposition/fabrique/fabrique';

export class FournisseurProfil {
    nom: string;
    adresse: string;
}

export class FournisseurEditeur implements EtapeDeFormulaireEditeur {

    créeContenus(): KfComposant[] {
        const champs: KfComposant[] = [];
        const nom = Fabrique.input.texte('nom', 'Nom');
        nom.ajouteValidateur(KfValidateurs.required);
        champs.push(nom);
        const adresse = Fabrique.input.texte('adresse', 'Adresse');
        adresse.ajouteValidateur(KfValidateurs.required);
        champs.push(adresse);
        return champs;
    }
}

export class FournisseurSite implements IKeyUidRno {
    uid: string;
    rno: number;
    nomSite: string;
    titre: string;

    static créeChamps(): KfComposant[] {
        const champs: KfComposant[] = [];
        const nomSite = Fabrique.input.texte('nomSite', 'Nom du site');
        nomSite.ajouteValidateur(KfValidateurs.required);
        champs.push(nomSite);
        const titre = Fabrique.input.texte('titre', 'Titre du site');
        titre.ajouteValidateur(KfValidateurs.required);
        champs.push(titre);
        return champs;
    }
}

export class FournisseurModel {
    nom: string;
    adresse: string;
    nomSite: string;
    titre: string;

    copieData(data: any) {
        this.nom = data['nom'];
        this.adresse = data['adresse'];
        this.nomSite = data['nomSite'];
        this.titre = data['titre'];
    }

    get model(): FournisseurModel {
        const model = new FournisseurModel();
        model.nom = this.nom;
        model.adresse = this.adresse;
        model.nomSite = this.nomSite;
        model.titre = this.titre;
        return model;
    }
    set model(model: FournisseurModel) {
        this.nom = model.nom;
        this.adresse = model.adresse;
        this.nomSite = model.nomSite;
        this.titre = model.titre;
    }

    get profil(): FournisseurProfil {
        return {
            nom: this.nom,
            adresse: this.adresse
        };
    }
    set profil(profil: FournisseurProfil) {
        this.nom = profil.nom;
        this.adresse = profil.adresse;
    }
    get site(): FournisseurSite {
        const site = new FournisseurSite();
        site.nomSite = this.nomSite;
        site.titre = this.titre;
        return site;
    }
    set site(site: FournisseurSite) {
        this.nomSite = site.nomSite;
        this.titre = site.titre;
    }
}

export class Fournisseur extends FournisseurModel implements IKeyUidRno {
    uid: string;
    rno: number;
}
