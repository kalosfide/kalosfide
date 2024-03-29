import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CategoriePages } from '../../fournisseur/catalogue/categories/categorie-pages';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { KeyIdEditeur } from 'src/app/commun/data-par-key/key-id/key-id-editeur';

export class CategorieEditeur extends KeyIdEditeur<Categorie> {
    kfNom: KfInputTexte;
    kfTexteEtat: KfInputTexte;

    constructor(component: IDataComponent) {
        super(component);
        this.keyAuto = true;
    }

    get service(): CategorieService {
        return this.component.iservice as CategorieService;
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

    créeNom(validateurs?: KfValidateur[]): KfInputTexte {
        if (!validateurs) {
            this.kfNom = Fabrique.input.texteLectureSeule('nom', 'Nom');
        } else {
            this.kfNom = Fabrique.input.texte('nom', 'Nom');
            validateurs.forEach(v => this.kfNom.ajouteValidateur(v));
        }
        return this.kfNom;
    }

    créeKfDeData() {
        switch (this.pageDef) {
            case CategoriePages.ajoute:
                this.kfDeData = [
                    this.créeNom(this.validateursNomAjoute()),
                ];
                break;
            case CategoriePages.edite:
                this.kfDeData = [
                    this.créeNom(this.validateursNomEdite()),
                ];
                break;
            default:
                break;
        }
        Fabrique.formulaire.préparePourPage(this.kfDeData);
    }
}
