import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfValidateurs, KfValidateur } from '../../commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from '../../disposition/fabrique/fabrique';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { EtapeDeFormulaireEditeur } from 'src/app/disposition/formulaire/etape-de-formulaire';
import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { Site } from './site';

export class SiteEditeur extends KeyUidRnoEditeur<Site> implements EtapeDeFormulaireEditeur {

    kfNom: KfInputTexte;
    kfTitre: KfInputTexte;

    private validateursNom(): KfValidateur[] {
        const texteAutorisés = `Seuls les 26 lettres minuscules, les 9 chiffres et '-' et '_' sont autorisés.`;
        const autorisés = KfValidateurs.chiffres.concat(KfValidateurs.minuscules).concat('-_');
        const carInterdit = KfValidateurs.validateurDeFn(
            'carInterdit',
            (value: any) => KfValidateurs.contientUnHorsDe(value, autorisés),
            texteAutorisés
        );
        const doublon = KfValidateurs.validateurDoublon('nomSitePris', 'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(50),
            carInterdit,
            doublon
        ];
    }

    private créeNom(validateurs: KfValidateur[]): KfInputTexte {
        if (!validateurs) {
            this.kfNom = Fabrique.input.texteLectureSeule('nomSite', 'Nom');
        } else {
            this.kfNom = Fabrique.input.texte('nomSite', 'Nom');
            this.kfNom.placeholder = 'ex: magasin_kalosfide ou le-magasin-de-kalosfide';
            this.kfNom.texteAide = Fabrique.texteAide(this.kfNom.nom,
                `Ce nom doit uniquement contenir des lettres minuscules non accentuées, des chiffres et '-' et '_'.`);
            validateurs.forEach(v => this.kfNom.ajouteValidateur(v));
        }
        return this.kfNom;
    }
    private créeAideNom(): KfEtiquette {
        return new KfEtiquette('aideNomSite', `Le nom de site est utilisé dans l'adresse internet de vos pages.`);
    }

    private validateursTitre(): KfValidateur[] {
        const doublon = KfValidateurs.validateurDoublon('titrePris', 'Ce titre est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            doublon
        ];
    }

    private créeTitre(validateurs: KfValidateur[]): KfInputTexte {
        if (!validateurs) {
            this.kfTitre = Fabrique.input.texteLectureSeule('titre', 'Titre');
        } else {
            this.kfTitre = Fabrique.input.texte('titre', 'Titre');
            this.kfTitre.placeholder = 'ex: Le magasin de Kalosfide';
            validateurs.forEach(v => this.kfTitre.ajouteValidateur(v));
        }
        return this.kfTitre;
    }

    créeKfDeData() {
    }

    créeContenus(): KfComposant[] {
        return [
            this.créeAideNom(),
            this.créeNom(this.validateursNom()),
            this.créeTitre(this.validateursTitre()),
        ];
    }
}
