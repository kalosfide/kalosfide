import { Produit } from 'src/app/modeles/catalogue/produit';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { TypeMesure } from 'src/app/modeles/type-mesure';
import { TypeCommande } from 'src/app/modeles/type-commande';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { ProduitPages } from '../../fournisseur/catalogue/produits/produit-pages';
import { Data } from '@angular/router';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsProduits } from 'src/app/modeles/catalogue/etat-produit';
import {
    KfListeDeroulanteNombre, KfListeDeroulanteTexte
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { ProduitService } from './produit.service';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';

export class ProduitEditeur extends KeyUidRnoNoEditeur<Produit> {
    categories: Categorie[];

    kfNom: KfInputTexte;
    kfCategorieNo: KfListeDeroulanteNombre;
    kfNomCategorie: KfInputTexte;
    kfTypeMesure: KfListeDeroulanteTexte;
    kfTypeMesureLS: KfInputTexte;
    kfTypeCommande: KfListeDeroulanteTexte;
    kfTypeCommandeLS: KfInputTexte;
    kfEtat: KfListeDeroulanteTexte;
    kfEtatLS: KfInputTexte;
    kfPrix: KfInputNombre;

    constructor(component: IDataKeyComponent) {
        super(component);
        this.keyAuto = true;
    }

    get service(): ProduitService {
        return this.component.iservice as ProduitService;
    }

    private validateursNomAjoute(): KfValidateur[] {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPris(value);
            },
            'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            validateur
        ];
    }
    private validateursNomEdite(): KfValidateur[] {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPrisParAutre(this._kfNo.valeur, value);
            },
            'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            validateur
        ];
    }

    private créeNom(validateurs?: KfValidateur[]) {
        if (!validateurs) {
            this.kfNom = Fabrique.input.texteLectureSeule('nom', 'Nom');
        } else {
            this.kfNom = Fabrique.input.texte('nom', 'Nom');
            validateurs.forEach(v => this.kfNom.ajouteValidateur(v));
        }
        this.ajouteChamps(this.kfNom);
    }

    private créeCategorie(lectureSeule?: boolean) {
        if (lectureSeule) {
            this.kfNomCategorie = Fabrique.input.texte('nomCategorie', 'Catégorie');
            this.kfNomCategorie.lectureSeule = true;
            this.ajouteChamps(this.kfNomCategorie);
        } else {
            const categorieNo = Fabrique.listeDéroulante.nombre('categorieNo', 'Catégorie');
            this.kfCategorieNo = categorieNo;
            categorieNo.ajouteValidateur(KfValidateurs.required);
            this.ajouteChamps(categorieNo);
        }
    }
    private créeTypesMesureEtCommande(lectureSeule?: boolean) {
        const titreMesure = 'Prix fixé...';
        const titreCommande = 'Mode de commande';
        if (lectureSeule) {
            this.kfTypeMesureLS = Fabrique.input.texte('texteTypeMesure', titreMesure);
            this.kfTypeMesureLS.lectureSeule = true;
            this.kfTypeMesureLS.estRacineV = true;
            this.kfTypeCommandeLS = Fabrique.input.texte('texteTypeCommande', titreCommande);
            this.kfTypeCommandeLS.lectureSeule = true;
            this.kfTypeCommandeLS.estRacineV = true;
            this.ajouteChamps(this.kfTypeMesureLS, this.kfTypeCommandeLS);
        } else {
            const typeMesure = Fabrique.listeDéroulante.texte('typeMesure', titreMesure);
            TypeMesure.Mesures.forEach(mesure => {
                typeMesure.créeEtAjouteOption(Fabrique.texte.typeMesure(mesure), mesure);
            });
            typeMesure.ajouteValidateur(KfValidateurs.required);
            typeMesure.créeOption0();
            typeMesure.valeur = TypeMesure.id.ALaPièce;

            const typeCommande = Fabrique.listeDéroulante.texte('typeCommande', titreCommande);
            TypeCommande.commandes.forEach(commande => {
                typeCommande.créeEtAjouteOption(Fabrique.texte.typeCommande(commande), commande);
            });
            typeCommande.ajouteValidateur(KfValidateurs.required);
            typeCommande.créeOption0();
            typeCommande.valeur = TypeCommande.id.ALUnité;

            this.ajouteChamps(typeMesure, typeCommande);

            const rafraichit = () => {
                if (typeMesure.valeur === TypeMesure.id.ALaPièce) {
                    typeCommande.valeur = TypeCommande.id.ALUnité;
                    typeCommande.options.forEach(option => {
                        option.inactif = option.valeur !== TypeCommande.id.ALUnité ? true : undefined;
                    });
                } else {
                    typeCommande.options.forEach(option => option.inactif = undefined);
                }
            };

            rafraichit();
            typeMesure.gereHtml.suitLaValeur = true;
            typeMesure.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, rafraichit);
        }
    }

    private créePrix(lectureSeule?: boolean) {
        this.kfPrix = Fabrique.input.nombrePrix('prix', 'Nouveau prix');
        this.kfPrix.min = 0;
        this.kfPrix.max = 999.99;
        this.kfPrix.pas = 0.05;
        this.kfPrix.lectureSeule = lectureSeule;
        this.ajouteChamps(this.kfPrix);
    }

    private créeEtat(lectureSeule?: boolean) {
        const titre = 'Etat';
        if (lectureSeule) {
            this.kfEtatLS = Fabrique.input.texteLectureSeule('texteEtat', titre);
            this.kfEtatLS.estRacineV = true;
            this.ajouteChamps(this.kfEtatLS);
        } else {
            const etat = Fabrique.listeDéroulante.texte('etat', titre);
            EtatsProduits.etats.forEach(e => etat.créeEtAjouteOption(e.texte, e.valeur));
            etat.ajouteValidateur(KfValidateurs.required);
            etat.créeOption0();
            etat.valeur = EtatsProduits.disponible.valeur;
            this.kfEtat = etat;
            this.ajouteChamps(etat);
        }
    }

    créeKfDeData() {
        const lectureSeule = true;

        switch (this.pageDef) {
            case ProduitPages.ajoute:
                this.créeCategorie();
                this.créeNom(this.validateursNomAjoute());
                this.créeTypesMesureEtCommande();
                this.créePrix();
                this.créeEtat();
                break;
            case ProduitPages.edite:
                this.créeCategorie();
                this.créeNom(this.validateursNomEdite());
                this.créeTypesMesureEtCommande();
                break;
            case ProduitPages.supprime:
                this.créeCategorie(lectureSeule);
                this.créeNom();
                this.créeTypesMesureEtCommande(lectureSeule);
                break;
            case ProduitPages.index:
                this.créeCategorie(lectureSeule);
                this.créeNom();
                this.créeTypesMesureEtCommande(lectureSeule);
                this.créePrix();
                this.créeEtat();
                break;
            default:
                break;
        }
    }

    chargeData(data: Data) {
        this.categories = data.categories;
        if (this.kfCategorieNo) {
            this.categories.forEach(c => this.kfCategorieNo.créeEtAjouteOption(c.nom, c.no));
            this.kfCategorieNo.valeur = this.categories[0].no;
        }
    }

    fixeValeur(produit: Produit) {
        this.edition.fixeValeur(produit);
        if (this.kfNomCategorie) {
            this.kfTypeMesureLS.valeur = TypeMesure.texte_le(produit.typeMesure);
            this.kfTypeCommandeLS.valeur = TypeCommande.pourListe(produit.typeCommande);
        }
    }
}
