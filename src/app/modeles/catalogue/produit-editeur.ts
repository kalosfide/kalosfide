import { Produit } from 'src/app/modeles/catalogue/produit';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { TypeMesure, TypeMesureFabrique } from 'src/app/modeles/type-mesure';
import { TypeCommande, TypeCommandeFabrique } from 'src/app/modeles/type-commande';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { ProduitPages } from '../../fournisseur/catalogue/produits/produit-pages';
import { Data } from '@angular/router';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsProduits } from 'src/app/modeles/catalogue/etat-produit';
import {
    KfListeDeroulanteBool,
    KfListeDeroulanteNombre, KfListeDeroulanteTexte
} from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-id-no/key-id-no-editeur';
import { ProduitService } from './produit.service';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { KfOptionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-option-texte';
import { Compare } from 'src/app/commun/outils/tri';
import { KeyIdEditeur } from 'src/app/commun/data-par-key/key-id/key-id-editeur';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';

export class ProduitEditeur extends KeyIdEditeur<Produit> {
    categories: Categorie[];

    kfNom: KfInputTexte;
    kfcategorieId: KfListeDeroulanteNombre;
    kfNomCategorie: KfInputTexte;
    kfTypeMesure: KfListeDeroulanteTexte;
    kfTypeMesureLS: KfInputTexte;
    kfTypeCommande: KfListeDeroulanteTexte;
    kfTypeCommandeLS: KfInputTexte;
    kfDisponible: KfListeDeroulanteBool;
    kfDisponibleLS: KfCaseACocher;
    kfPrix: KfInputNombre;

    constructor(component: IDataComponent) {
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
            KfValidateurs.trim,
            validateur
        ];
    }
    private validateursNomEdite(): KfValidateur[] {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPrisParAutre(this._kfId.valeur, value);
            },
            'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            KfValidateurs.trim,
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
        this.kfDeData.push(this.kfNom);
    }

    private créeCategorie(lectureSeule?: boolean) {
        if (lectureSeule) {
            this.kfNomCategorie = Fabrique.input.texte('nomCategorie', 'Catégorie');
            this.kfNomCategorie.lectureSeule = true;
            this.kfDeData.push(this.kfNomCategorie);
        } else {
            const categorieId = Fabrique.listeDéroulante.nombre('categorieId', 'Catégorie');
            this.kfcategorieId = categorieId;
            categorieId.ajouteValidateur(KfValidateurs.required);
            this.kfDeData.push(categorieId);
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
            this.kfDeData.push(this.kfTypeMesureLS, this.kfTypeCommandeLS);
        } else {
            const typeMesure = Fabrique.listeDéroulante.nombre('typeMesure', titreMesure);
            TypeMesureFabrique.Mesures.forEach(mesure => {
                typeMesure.créeEtAjouteOption(Fabrique.texte.typeMesure(mesure), mesure);
            });
            typeMesure.ajouteValidateur(KfValidateurs.required);
            typeMesure.valeur = TypeMesure.Aucune;

            const typeCommande = Fabrique.listeDéroulante.nombre('typeCommande', titreCommande);
            TypeCommandeFabrique.commandes.forEach(commande => {
                typeCommande.créeEtAjouteOption(Fabrique.texte.typeCommande(commande), commande);
            });
            typeCommande.ajouteValidateur(KfValidateurs.required);
            typeCommande.valeur = TypeCommande.ALUnité;

            this.kfDeData.push(typeMesure, typeCommande);

            const rafraichit = () => {
                if (typeMesure.valeur === TypeMesure.Aucune) {
                    typeCommande.valeur = TypeCommande.ALUnité;
                    typeCommande.options.forEach(option => {
                        option.inactif = option.valeur !== TypeCommande.ALUnité ? true : undefined;
                    });
                } else {
                    typeCommande.options.forEach(option => option.inactif = undefined);
                }
            };

            rafraichit();
            typeMesure.gereHtml.suitLaValeur();
            typeMesure.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, rafraichit);
        }
    }

    private créePrix(lectureSeule?: boolean) {
        this.kfPrix = Fabrique.input.nombre('prix', 'Prix');
        this.kfPrix.min = 0;
        this.kfPrix.max = 999.99;
        this.kfPrix.pas = 0.05;
        this.kfPrix.lectureSeule = lectureSeule;
        if (!lectureSeule) {
            this.kfPrix.ajouteValidateur(KfValidateurs.required, KfValidateurs.nombreVirgule(7, 2, '>'));
        }
        this.kfDeData.push(this.kfPrix);
    }

    private créeEtat(lectureSeule?: boolean) {
        const titre = 'Disponible';
        if (lectureSeule) {
            this.kfDisponibleLS = new KfCaseACocher('disponible', titre);
            this.kfDisponibleLS.estRacineV = true;
            this.kfDeData.push(this.kfDisponibleLS);
        } else {
            const disponible = Fabrique.listeDéroulante.bool('disponible', titre);
            EtatsProduits.états.forEach(e => disponible.créeEtAjouteOption(e.texte, e.valeur));
            disponible.ajouteValidateur(KfValidateurs.required);
            this.kfDisponible = disponible;
            this.kfDeData.push(disponible);
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
                Fabrique.formulaire.préparePourPage(this.kfDeData);
                break;
            case ProduitPages.edite:
                this.créeCategorie();
                this.créeNom(this.validateursNomEdite());
                this.créeTypesMesureEtCommande();
                Fabrique.formulaire.préparePourPage(this.kfDeData);
                break;
            case ProduitPages.index:
                this.créeCategorie(lectureSeule);
                this.créeNom();
                this.créeTypesMesureEtCommande(lectureSeule);
                this.créePrix();
                this.créeEtat();
                Fabrique.formulaire.préparePourVueTable(this.kfDeData);
                break;
            default:
                break;
        }
    }

    chargeData(data: Data) {
        const categories = (data.categories as Categorie[])
            .map(c => c)
            .sort(Compare.texte((c: Categorie) => c.nom));
        if (this.kfcategorieId) {
            categories.forEach(c => this.kfcategorieId.créeEtAjouteOption(c.nom, c.id));
            this.kfcategorieId.valeur = categories[0].id;
        }
    }

    fixeValeur(produit: Produit) {
        this.edition.fixeValeur(produit);
        if (this.kfNomCategorie) {
            this.kfTypeMesureLS.valeur = TypeMesureFabrique.texte_le(produit.typeMesure);
            this.kfTypeCommandeLS.valeur = TypeCommandeFabrique.pourListe(produit.typeCommande);
        }
    }
}
