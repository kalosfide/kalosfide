import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import {  Client } from 'src/app/modeles/client/client';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { FournisseurClientPages } from '../../fournisseur/clients/client-pages';
import { TexteEtatClient } from 'src/app/modeles/client/etat-client';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { Role } from './role';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

export class RoleEditeur extends KeyUidRnoEditeur<Role> {
    texteEtat: KfInputTexte;

    kfNom: KfInputTexte;
    kfAdresse: KfInputTexte;
    kfTexteEtat: KfInputTexte;

    constructor(component: IDataComponent) {
        super(component);
        this.keyAuto = true;
    }

    validateursNom(): KfValidateur[] {
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            KfValidateurs.trim,
        ];
    }

    ajouteAideNom(usager: 'client' | 'fournisseur', complément?: string): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        Fabrique.ajouteTexte(étiquette,
            `Le nom du ${usager} est utilisé dans l'en-tête des documents${complément ? ' ' + complément : ''}.`
        );
        this.kfDeData.push(étiquette);
        return étiquette;
    }

    ajouteNom(usager: 'client' | 'fournisseur', validateurs?: KfValidateur[]): KfInputTexte {
        const texte = `Nom du ${usager}`;
        if (!validateurs) {
            this.kfNom = Fabrique.input.texteLectureSeule('nom', texte);
        } else {
            this.kfNom = Fabrique.input.texte('nom', texte);
            validateurs.forEach(v => this.kfNom.ajouteValidateur(v));
        }
        this.kfDeData.push(this.kfNom);
        return this.kfNom;
    }

    validateursAdresse(): KfValidateur[] {
        const validateurs: KfValidateur[] = [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            KfValidateurs.trim,
        ];
        return validateurs;
    }

    ajouteAideAdresse(usager: 'client' | 'fournisseur'): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        Fabrique.ajouteTexte(étiquette,
            `L'adresse du ${usager} est utilisée dans l'en-tête des documents.`
        );
        this.kfDeData.push(étiquette);
        return étiquette;
    }
    ajouteAdresse(validateurs?: KfValidateur[]): KfInputTexte {
        if (!validateurs) {
            this.kfAdresse = Fabrique.input.texteLectureSeule('adresse', 'Adresse');
        } else {
            this.kfAdresse = Fabrique.input.texte('adresse', 'Adresse');
            validateurs.forEach(v => this.kfAdresse.ajouteValidateur(v));
        }
        this.kfDeData.push(this.kfAdresse);
        return this.kfAdresse;
    }

    ajouteEtat(): KfInputTexte {
        const état = Fabrique.input.texteInvisible('etat');
        this.kfDeData.push(état);
        return état;
    }

    ajouteTexteEtat(): KfInputTexte {
        this.kfTexteEtat = Fabrique.input.texteLectureSeule('texteEtat', 'Etat');
        this.kfTexteEtat.estRacineV = true;
        this.kfDeData.push(this.kfTexteEtat);
        return this.kfTexteEtat;
    }

    créeKfDeData() {}
}
