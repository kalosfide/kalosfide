import { Produit } from '../catalogue/produit';
import { KeyUidRnoNo2Editeur } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2-editeur';
import { ApiLigneData } from './api-ligne';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { KfListeDeroulanteTexte } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { TypeMesure } from '../type-mesure';
import { TypeCommande } from '../type-commande';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { CommandePages } from 'src/app/client/commandes/commande-pages';
import { LivraisonPages } from 'src/app/fournisseur/livraisons/livraison-pages';
import { FacturePages } from 'src/app/fournisseur/factures/facture-pages';
import { CLFLigne } from './c-l-f-ligne';
import { CLFService } from './c-l-f.service';
import { CLFUtileTexteChamp } from './c-l-f-utile-texte';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';

export class CLFLigneEditeur extends KeyUidRnoNo2Editeur<CLFLigne> {
    private ligne: CLFLigne;

    get produit(): Produit { return this.ligne.produit; }
    get data(): ApiLigneData { return this.ligne.apiData; }

    kfTypeCommande: KfListeDeroulanteTexte;
    kfTypeCommandeLS: KfInputTexte;
    kfQuantitéLS: KfInputTexte;
    kfQuantité: KfInputNombre;
    kfAFixerLS: KfInputTexte;
    kfAFixer: KfInputNombre;

    constructor(ligne: CLFLigne, component: IDataComponent) {
        super(component);
        this.ligne = ligne;
    }

    get service(): CLFService {
        return this.component.iservice as CLFService;
    }

    private créeCatégorie(): KfInputTexte {
        return Fabrique.input.texteLectureSeule('categorie', 'Catégorie', this.produit.nomCategorie);
    }

    private créeProduit(): KfInputTexte {
        return Fabrique.input.texteLectureSeule('produit', 'Produit', this.produit.nom);
    }

    private créePrix(): KfInputTexte {
        return Fabrique.input.texteLectureSeule('prix', 'Prix', Fabrique.texte.produit_prix(this.produit));
    }

    private créeUnitéPrix(): KfInputTexte {
        const input = Fabrique.input.texteLectureSeule('unité-prix', 'Unité',
            TypeMesure.texteUnités(this.produit.typeMesure, this.produit.typeCommande));
        input.ajouteClasse('unite');
        return input;
    }

    private créeTypeCommandeListe(lectureSeule?: boolean): KfListeDeroulanteTexte | KfInputTexte {
        const titre = 'Unité';
        const nom = 'typeCommande';
        const typeCommande = this.produit.typeCommande;
        const valeur = this.data.typeCommande
            ? this.data.typeCommande
            : TypeMesure.typeCommandeParDéfaut(this.produit.typeMesure);
        const texte = (id: string) => {
            return TypeMesure.texteUnités(this.produit.typeMesure, id);
        };
        let input: KfListeDeroulanteTexte | KfInputTexte;
        if (lectureSeule || typeCommande !== TypeCommande.id.ALUnitéOuEnVrac) {
            this.kfTypeCommandeLS = Fabrique.input.texteLectureSeule(nom + '_ls', titre, texte(valeur));
            input = this.kfTypeCommandeLS;
        } else {
            this.kfTypeCommande = Fabrique.listeDéroulante.texte(nom, titre);
            if (typeCommande === TypeCommande.id.ALUnitéOuEnVrac || typeCommande === TypeCommande.id.EnVrac) {
                this.kfTypeCommande.créeEtAjouteOption(texte(TypeCommande.id.EnVrac), TypeCommande.id.EnVrac);
            }
            if (typeCommande === TypeCommande.id.ALUnitéOuEnVrac || typeCommande === TypeCommande.id.ALUnité) {
                this.kfTypeCommande.créeEtAjouteOption(texte(TypeCommande.id.ALUnité), TypeCommande.id.ALUnité);
            }
            this.kfTypeCommande.ajouteValidateur(KfValidateurs.required);
            this.kfTypeCommande.valeur = valeur;
            input = this.kfTypeCommande;
        }
        input.ajouteClasse('unite');
        return input;
    }

    private créeQuantité(titre: string, lectureSeule?: boolean): KfInputNombre | KfInputTexte {
        const nom = 'quantité';
        let input: KfInputNombre | KfInputTexte;
        if (lectureSeule) {
            this.kfQuantitéLS = Fabrique.input.texteLectureSeule(nom + '_ls', titre,
                Fabrique.texte.quantitéAvecUnité(this.produit, this.data.quantité));
            input = this.kfQuantitéLS;
        } else {
            this.kfQuantité = Fabrique.input.nombreQuantité(nom, () => this.data.typeCommande
                ? this.data.typeCommande
                : TypeMesure.typeCommandeParDéfaut(this.ligne.produit.typeMesure), titre);
            const valeur = this.data.quantité;
            if (valeur) {
                this.kfQuantité.valeur = valeur;
            }
            this.kfQuantité.ajouteValidateur(KfValidateurs.nombreNonNul);
            input = this.kfQuantité;
        }
        input.ajouteClasse('nombre', 'quantite');
        return input;
    }

    private lieDemandeEtTypeCommande() {
        if (!this.kfTypeCommande) {
            return;
        }
        this.kfTypeCommande.gereHtml.suitLaValeur();
        this.kfTypeCommande.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            (evenement: KfEvenement) => {
                const pas = TypeCommande.pasInputNombre(this.kfTypeCommande.valeur);
                if (this.kfQuantité.pas !== pas) {
                    this.kfQuantité.valeur = 0;
                    this.kfQuantité.pas = pas;
                }
                evenement.statut = KfStatutDEvenement.fini;
            }
        );
    }

    private créeAFixer(titre: string, lectureSeule?: boolean): KfInputNombre | KfInputTexte {
        const nom = 'aFixer';
        let input: KfInputNombre | KfInputTexte;
        if (lectureSeule) {
            this.kfAFixerLS = Fabrique.input.texteLectureSeule(nom + '_ls', titre,
                Fabrique.texte.quantitéAvecUnité(this.produit, this.data.aFixer));
            input = this.kfAFixerLS;
        } else {
            this.kfAFixer = Fabrique.input.nombreQuantité(nom,
                () => TypeMesure.typeCommandeParDéfaut(this.produit.typeMesure), titre);
            const valeur = this.data.aFixer;
            if (valeur >= 0) {
                this.kfAFixer.valeur = valeur;
            }
            this.kfAFixer.ajouteValidateur(KfValidateurs.required);
            input = this.kfAFixer;
        }
        input.ajouteClasse('nombre', 'quantite');
        return input;
    }

    créeKfDeData() {
        const lectureSeule = true;
        let champ: CLFUtileTexteChamp;
        switch (this.pageDef) {
            case CommandePages.ajoute:
                champ = this.service.utile.texte.commande.champ;
                this.kfDeData = [
                    this.créeCatégorie(),
                    this.créeProduit(),
                    this.créePrix(),
                    this.créeQuantité(champ.aFixer),
                    this.créeTypeCommandeListe(),
                ];
                this.lieDemandeEtTypeCommande();
                this.kfQuantité.ajouteValidateur(KfValidateurs.required);
                KfBootstrap.prépare(this.kfDeData, Fabrique.optionsBootstrap.formulaire);
                break;
            case LivraisonPages.ajoute:
            case FacturePages.ajoute:
                champ = this.service.utile.texte.livraison.champ;
                this.kfDeData = [
                    this.créeCatégorie(),
                    this.créeProduit(),
                    this.créePrix(),
                    this.créeQuantité(champ.source, lectureSeule),
                    this.créeTypeCommandeListe(lectureSeule),
                    this.créeAFixer(champ.aFixer),
                    this.créeUnitéPrix(),
                ];
                this.kfQuantitéLS.nePasAfficher = true;
                this.kfTypeCommandeLS.nePasAfficher = true;
                this.kfAFixer.ajouteValidateur(KfValidateurs.min(0));
                KfBootstrap.prépare(this.kfDeData, Fabrique.optionsBootstrap.formulaire);
                break;
            case CommandePages.lignes:
                champ = this.service.utile.texte.commande.champ;
                this.kfDeData = [
                    this.créeQuantité(champ.aFixer),
                    this.créeTypeCommandeListe(),
                ];
                this.lieDemandeEtTypeCommande();
                this.kfQuantité.ajouteValidateur(KfValidateurs.required);
                KfBootstrap.prépare(this.kfDeData, Fabrique.optionsBootstrap.dansVueTable);
                break;
            case LivraisonPages.lignes:
            case FacturePages.lignes:
                champ = this.service.utile.texte.livraison.champ;
                this.kfDeData = [
                    this.créeQuantité(champ.source, lectureSeule),
                    this.créeTypeCommandeListe(lectureSeule),
                    this.créeAFixer(champ.aFixer),
                ];
                this.kfAFixer.ajouteValidateur(KfValidateurs.required);
                KfBootstrap.prépare(this.kfDeData, Fabrique.optionsBootstrap.dansVueTable);
                break;

            default:
                console.log(this.pageDef);
                break;
        }
    }
}
