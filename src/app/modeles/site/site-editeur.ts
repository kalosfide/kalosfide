import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfValidateurs, KfValidateur } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { Site } from './site';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { RoleEditeur } from '../role/role-editeur';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { FSitePages } from 'src/app/fournisseur/f-site/f-site-pages';

export class SiteEditeur extends KeyUidRnoEditeur<Site> {
    kfNom: KfInputTexte;
    kfUrl: KfInputTexte;
    kfTitre: KfInputTexte;

    constructor(component: IDataComponent) {
        super(component);
    }

    ajouteAideUrl(): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        étiquette.ajouteTextes(
            `Le nom du site est utilisé dans l'adresse internet de vos pages.`
        );
        return étiquette;
    }

    ajouteUrl(): KfInputTexte {
        this.kfUrl = Fabrique.input.texte('url', 'Nom du site');
        this.kfUrl.texteAide = Fabrique.étiquetteAide(this.kfUrl.nom,
            `Ce nom doit uniquement contenir des lettres minuscules non accentuées, des chiffres et '-' et '_'.`);
        const texteAutorisés = `Seuls les 26 lettres minuscules, les 9 chiffres et '-' et '_' sont autorisés.`;
        const autorisés = KfValidateurs.chiffres.concat(KfValidateurs.minuscules).concat('-_');
        const carInterdit = KfValidateurs.validateurDeFn(
            'carInterdit',
            (value: any) => KfValidateurs.contientUnHorsDe(value, autorisés),
            texteAutorisés
        );
        const doublon = KfValidateurs.validateurAMarque('nomPris', 'Ce nom est déjà pris');
        this.kfUrl.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.longueurMax(50),
            carInterdit,
            doublon
        );
        return this.kfUrl;
    }

    ajouteAideTitre(): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        étiquette.ajouteTextes(
            `Le titre du site est utilisé dans les menus et les titres de vos pages.`
        );
        return étiquette;
    }

    ajouteTitre(): KfInputTexte {
        this.kfTitre = Fabrique.input.texte('titre', 'Titre du site');
        this.kfTitre.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            KfValidateurs.trim,
        );
        return this.kfTitre;
    }

    créeKfDeData() {
        this.kfDeData = [
            this.ajouteAideUrl(),
            this.ajouteUrl(),
            this.ajouteAideTitre(),
            this.ajouteTitre(),

        ];
        Fabrique.formulaire.préparePourPage(this.kfDeData);
    }
}
