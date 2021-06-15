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
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';

export class SiteEditeur extends KeyUidRnoEditeur<Site> {
    placeholder = 'François Maréchal';
    placeholderPréfixe = 'ex: ';

    kfNom: KfInputTexte;
    kfUrl: KfInputTexte;
    kfTitre: KfInputTexte;

    ajoutePréfixe = (texte: string) => this.placeholderPréfixe + texte;
    enlèvePréfixe = (texte: string) => texte.slice(this.placeholderPréfixe.length);
    transforme = (texte: string) => {
        if (!texte) {
            return null;
        }
        return texte
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(' ', '-');
    }

    constructor(component: IDataComponent) {
        super(component);
    }

    créeAideUrl(): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        Fabrique.ajouteTexte(étiquette,
            `Le nom du site est utilisé dans l'adresse internet de vos pages.`
        );
        return étiquette;
    }
    créeUrl(): KfInputTexte {
        this.kfUrl = Fabrique.input.texte('url', 'Nom du site');
        this.kfUrl.placeholder = this.ajoutePréfixe(this.transforme(this.placeholder));
        this.kfUrl.ajouteCopieur(Fabrique.icone.def.copier, this.kfNom, this.transforme);
        this.kfUrl.ajouteEffaceur(Fabrique.icone.def.croix);
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

    créeTitre(): KfInputTexte {
        this.kfTitre = Fabrique.input.texte('titre', 'Titre du site');
        this.kfTitre.ajouteCopieur(Fabrique.icone.def.copier, this.kfNom);
        this.kfTitre.ajouteEffaceur(Fabrique.icone.def.croix);
        this.kfTitre.placeholder = this.ajoutePréfixe(this.placeholder);
        this.kfTitre.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            KfValidateurs.trim,
        );
        return this.kfTitre;
    }
    créeAideTitre(): KfEtiquette {
        const étiquette = Fabrique.ajouteEtiquetteP();
        Fabrique.ajouteTexte(étiquette,
            `Le titre du site est utilisé dans les menus et les titres de vos pages.`
        );
        return étiquette;
    }

    créeAutresChamps(): KfComposant[] {
        const champs: KfComposant[] = [];
        Fabrique.ajouteTexte(Fabrique.ajouteEtiquetteP(champs),
            `L'adresse est utilisé dans l'en-tête des documents.`
        );
        const adresse = Fabrique.input.texte('adresse', 'Adresse');
        adresse.ajouteValidateur(KfValidateurs.required);
        champs.push(adresse);
        return champs;
    }

    créeKfDeData() {
        const roleEditeur = new RoleEditeur(this.component);
        roleEditeur.kfDeData = [];
        this.kfDeData = roleEditeur.kfDeData;
        switch (this.pageDef) {
            case AppSitePages.devenirFournisseur:
                roleEditeur.ajouteAideNom('fournisseur');
                this.kfNom = roleEditeur.ajouteNom('fournisseur', roleEditeur.validateursNom());
                this.kfNom.placeholder = this.ajoutePréfixe(this.placeholder);
                this.kfNom.gereHtml.suitLaValeur();
                this.kfNom.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                    () => {
                        const texte = this.kfNom.valeur ? this.kfNom.valeur : this.enlèvePréfixe(this.kfNom.placeholder);
                        this.kfUrl.placeholder = this.ajoutePréfixe(this.transforme(texte));
                        this.kfTitre.placeholder = this.ajoutePréfixe(texte);
                    });
                this.kfDeData.push(
                    this.créeAideUrl(),
                    this.créeUrl(),
                    this.créeAideTitre(),
                    this.créeTitre(),
                );
                roleEditeur.ajouteAideAdresse('fournisseur');
                roleEditeur.ajouteAdresse(roleEditeur.validateursAdresse());
                KfBootstrap.prépare(this.kfDeData, Fabrique.optionsBootstrap.formulaire);
                break;
            case FSitePages.edite:
                break;
            default:
                break;
        }
    }
}
