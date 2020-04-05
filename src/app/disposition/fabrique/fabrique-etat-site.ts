import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse, Fabrique } from './fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

export class EtatSite extends FabriqueMembre {
    id: IdEtatSite;

    /**
     * nom de l'état
     */
    nom: string;

    /**
     * titre à afficher dans la description de l'état
     */
    titre: string;

    /**
     * article à ajouter au titre
     */
    article: string;

    get article_Titre(): string {
        return this.article + ' ' + this.titre;
    }

    get article_titre(): string {
        return this.article + ' ' + TexteOutils.initiale(this.titre);
    }

    get Article_Titre(): string {
        return TexteOutils.Initiale(this.article) + ' ' + this.titre;
    }

    /**
     * pageDef de la page pour changer l'état
     */
    pageDef: PageDef;
    description: () => KfComposant[];
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }
}

export class FabriqueEtatSite extends FabriqueMembre {
    private pEtats: EtatSite[];

    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
        this.créeEtats();
    }

    titre = 'Etats du site';

    intro = `Le site a trois états qui définissent les actions possibles du fournisseur et des clients qui ont un compte de connexion.`;

    get vueTableDef(): IKfVueTableDef<EtatSite> {
        const vueTableDef: IKfVueTableDef<EtatSite> = {
            colonnesDef: [
                { nom: 'nom', enTeteDef: { titreDef: 'Etat' }, créeContenu: (état: EtatSite) => état.nom, },
                { nom: 'titre', enTeteDef: { titreDef: 'Description' }, créeContenu: (état: EtatSite) => état.titre },
                {
                    nom: 'action', enTeteDef: { titreDef: 'Remarques' }, créeContenu: (état: EtatSite) => {
                        const groupe = new KfGroupe('');
                        état.description().forEach(d => groupe.ajoute(d));
                        return groupe;
                    }
                }
            ]
        };
        return vueTableDef;
    }

    private créeCatalogue(): EtatSite {
        const état = new EtatSite(this.fabrique);
        état.id = IdEtatSite.catalogue;
        état.pageDef = FournisseurPages.catalogue;
        état.nom = 'Catalogue';
        état.article = 'la';
        état.titre = 'Modification du catalogue';
        état.description = () => {
            const description: KfComposant[] = [];
            let etiquette: KfEtiquette;
            etiquette = new KfEtiquette('');
            etiquette = this.fabrique.ajouteEtiquetteP(description);
            this.fabrique.ajouteTexte(etiquette,
                `La `,
                { texte: this.catalogue.titre, balise: KfTypeDeBaliseHTML.i },
                ` ne peut commencer que s'il n'y a pas de commande en attente ou en cours de traitement ou non facturées.`
            );

            etiquette = this.fabrique.ajouteEtiquetteP(description);
            this.fabrique.ajouteTexte(etiquette,
                `Pendant la `,
                { texte: this.catalogue.titre, balise: KfTypeDeBaliseHTML.i },
                `, les commandes sont arrétées.`
            );

            return description;
        };
        return état;
    }

    private créeOuvert(): EtatSite {
        const état = new EtatSite(this.fabrique);
        état.id = IdEtatSite.ouvert;
        état.pageDef = null;
        état.nom = 'Ouvert';
        état.titre = 'Commandes ouvertes';
        état.description = () => {
            const description: KfComposant[] = [];
            let etiquette: KfEtiquette;
            etiquette = this.fabrique.ajouteEtiquetteP(description);
            this.fabrique.ajouteTexte(etiquette,
                `Le site est dans cet état quand il n'y a pas `,
                { texte: this.catalogue.titre, balise: KfTypeDeBaliseHTML.i },
                ` en cours.`
            );

            etiquette = this.fabrique.ajouteEtiquetteP(description);
            this.fabrique.ajouteTexte(etiquette,
                `Les clients qui se connectent peuvent commander. Le fournisseur peut commander pour un client qui n'a pas de compte.`);

            return description;
        };
        return état;
    }

    private créeEtats() {
        this.pEtats = [
            this.créeCatalogue(),
            this.créeOuvert(),
        ];
    }

    get catalogue(): EtatSite {
        return this.pEtats[0];
    }
    get ouvert(): EtatSite {
        return this.pEtats[1];
    }

    get états(): EtatSite[] {
        return this.pEtats;
    }

    état(id: string): EtatSite {
        switch (id) {
            case IdEtatSite.ouvert:
                return this.ouvert;
            case IdEtatSite.catalogue:
                return this.catalogue;
            default:
                return undefined;
        }
    }
}
