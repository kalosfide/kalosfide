import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { KfEvenement, KfStatutDEvenement, KfTypeDEvenement, KfTypeDHTMLEvents } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { AppSitePages } from 'src/app/app-site/app-site-pages';
import { RoleEditeur } from '../role/role-editeur';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { FSitePages } from 'src/app/fournisseur/f-site/f-site-pages';
import { Fournisseur } from './fournisseur';
import { SiteEditeur } from '../site/site-editeur';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';

export class FournisseurEditeur extends KeyUidRnoEditeur<Fournisseur> {
    roleEditeur: RoleEditeur;
    siteEditeur: SiteEditeur;

    placeholder = 'François Maréchal';
    placeholderPréfixe = 'ex: ';

    ajoutePréfixe = (texte: string) => this.placeholderPréfixe + texte;
    enlèvePréfixe = (texte: string) => texte.slice(this.placeholderPréfixe.length);
    transforme = (texte: string) => {
        if (!texte) {
            return null;
        }
        return texte
            .toLowerCase()
            .replace(/\s/g, '-')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    constructor(component: IDataComponent) {
        super(component);
    }

    créeKfDeData() {
        this.roleEditeur = new RoleEditeur(this.component, 'fournisseur');
        this.roleEditeur.créeKfDeData();
        this.siteEditeur = new SiteEditeur(this.component);
        this.siteEditeur.créeKfDeData();
        const titre: (texte: string) => KfComposant = (texte: string) => {
            const étiquette = Fabrique.ajouteEtiquetteP();
            étiquette.ajouteClasse(KfBootstrap.classeTexte({ poids: 'bold' }));
            étiquette.fixeTexte(texte);
            return étiquette;
        };
        this.kfDeData = [titre('Identification de la société')]
            .concat(this.roleEditeur.kfDeData, [titre('Définition du site')], this.siteEditeur.kfDeData);
        switch (this.pageDef) {
            case AppSitePages.nouveauSite:
                const kfUrl = this.siteEditeur.kfUrl;
                let urlTouché = false;
                kfUrl.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
                kfUrl.gereHtml.ajouteTraiteur(KfTypeDEvenement.keypress,
                    (événement: KfEvenement) => {
                        urlTouché = true;
                        événement.statut = KfStatutDEvenement.fini;
                    })
                const kfTitre = this.siteEditeur.kfTitre;
                let titreTouché = false;
                kfTitre.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.keypress);
                kfTitre.gereHtml.ajouteTraiteur(KfTypeDEvenement.keypress,
                    (événement: KfEvenement) => {
                        titreTouché = true;
                        événement.statut = KfStatutDEvenement.fini;
                    })
                const kfNom = this.roleEditeur.kfNom;
                kfNom.placeholder = this.ajoutePréfixe(this.placeholder);
                kfNom.gereHtml.suitLaValeur();
                kfNom.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                    () => {
                        const texte = kfNom.valeur ? kfNom.valeur : this.enlèvePréfixe(kfNom.placeholder);
                        if (!urlTouché) {
                            kfUrl.valeur = this.transforme(texte);
                        }
                        if (!titreTouché) {
                            kfTitre.valeur = texte;
                        }
                    });
                break;
            case FSitePages.edite:
                break;
            default:
                break;
        }
    }
}
