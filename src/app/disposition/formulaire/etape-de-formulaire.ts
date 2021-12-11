import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { FormulaireAEtapesComponent } from './formulaire-a-etapes.component';
import { PageDef } from 'src/app/commun/page-def';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

export interface EtapeDeFormulaireEditeur {
    créeContenus(): KfComposant[];
}
export class EtapeDeFormulaire {
    parent: FormulaireAEtapesComponent;

    index: number;
    pageDef: PageDef;
    éditeur: EtapeDeFormulaireEditeur;

    groupeEditeur: KfGroupe;
    groupeEtat: KfGroupe;
    etat: KfEtiquette;

    constructor(index: number, pageDef: PageDef, éditeur: EtapeDeFormulaireEditeur) {
        this.index = index;
        this.pageDef = pageDef;
        this.éditeur = éditeur;
    }

    get nom(): string {
        return this.pageDef.path;
    }
    get texteLien(): string {
        return this.pageDef.lien;
    }

    créeEdition(): KfGroupe {
        this.groupeEditeur = new KfGroupe(this.nom);
        this.groupeEditeur.ajouteClasse('tab-pane');
        const titre = new KfEtiquette(this.nom + '-titre', this.pageDef.titre);
        titre.baliseHtml = KfTypeDeBaliseHTML.h5;
        this.groupeEditeur.ajoute(titre);
        let avecValeur: boolean;
        this.éditeur.créeContenus().forEach(contenu => {
            this.groupeEditeur.ajoute(contenu);
            if (contenu.gereValeur) {
                avecValeur = true;
            }
        });
        if (avecValeur) {
//            this.groupeEditeur.créeGereValeur();
        }
        return this.groupeEditeur;
    }

    créeGroupeEtat(): KfGroupe {
        this.groupeEtat = new KfGroupe(this.nom + 'etat');
        const etiquette = new KfEtiquette('', this.texteLien);
        etiquette.ajouteClasse('');
        this.groupeEtat.ajoute(etiquette);
        this.etat = new KfEtiquette('', '');
        this.etat.fixeTexte(() => this.estInitial ? '' : this.estValide ? 'Ok' : 'INVALIDE');
        this.etat.ajouteClasse(() => this.estInitial ? '' : this.estValide ? 'success' : 'danger');
        this.groupeEtat.ajoute(this.etat);
        return this.groupeEtat;
    }

    get estValide(): boolean {
        for (const contenu of this.groupeEditeur.contenus) {
            if (contenu.abstractControl && !contenu.abstractControl.valid) {
                return false;
            }
        }
        return true;
    }

    get estInitial(): boolean {
        for (const contenu of this.groupeEditeur.contenus) {
            if (contenu.abstractControl && !contenu.abstractControl.pristine) {
                return false;
            }
        }
        return true;
    }

}

