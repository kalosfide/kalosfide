import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfValidateurs, KfValidateur } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { IKeyUidRno } from '../../commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { EtapeDeFormulaireEditeur } from '../../disposition/formulaire/etape-de-formulaire';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { FournisseurService } from './fournisseur.service';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { PageDef } from 'src/app/commun/page-def';

export class Fournisseur extends KeyUidRno {
    uid: string;
    rno: number;
    nom: string;
    adresse: string;

}

export class FournisseurProfil {
    nom: string;
    adresse: string;
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
