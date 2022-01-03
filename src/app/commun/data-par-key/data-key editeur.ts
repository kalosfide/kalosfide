import { PageDef } from '../page-def';
import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';
import { IDataComponent } from './i-data-component';
import { IDataKey } from './data-key';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

export abstract class DataKeyEditeur<T extends IDataKey> {
    protected groupe: KfGroupe;
    protected component: IDataComponent;

    /**
     * vrai si la clé est générée par la base de données
     */
    keyAuto: boolean;
    /**
     * champs de Key
     */
    kfDeKey: KfComposant[];
    /**
     * champs éditables ou en lecture seule
     */
    kfDeData: KfComposant[];

    constructor(component: IDataComponent) {
        this.component = component;
    }

    get pageDef(): PageDef {
        return this.component.pageDef;
    }

    protected abstract créeKfDeKey(): void;
    abstract fixeKfKey(key: IDataKey): void;
    abstract fixeIdDeAjout(key: T): void;
    protected abstract créeKfDeData(): void;

    get valide(): boolean {
        if (!this.kfDeData) {
            return;
        }
        let valide: boolean;
        for (const composant of this.kfDeData) {
            if (composant.gereValeur) {
                if (composant.gereValeur.invalide) {
                    return false;
                }
                valide = true;
            }
        }
        return valide;
    }

    private prepareGroupe() {
        this.kfDeKey = [];
        this.créeKfDeKey();
        this.kfDeKey.forEach(c => this.groupe.ajoute(c));
        this.kfDeData = [];
        this.créeKfDeData();
        this.kfDeData.forEach(c => this.groupe.ajoute(c));
    }

    créeFormulaire() {
        this.groupe = Fabrique.formulaire.formulaire();
        this.prepareGroupe();
    }
    get edition(): KfGroupe {
        return this.groupe;
    }
    get valeur(): T {
        return this.groupe.valeur;
    }
    fixeValeur(valeur: T) {
        console.log(this.edition);
        console.log(valeur, this.edition.valeur, this.edition.formGroup);
        this.edition.fixeValeur(valeur);
        /*
        */
    }

    créeSuperGroupe(): KfSuperGroupe {
        this.groupe = new KfSuperGroupe('');
        this.groupe.créeGereValeur();
        this.prepareGroupe();
        const superGroupe = this.groupe as KfSuperGroupe;
        superGroupe.quandTousAjoutés();
        return superGroupe;
    }
    get superGroupe(): KfSuperGroupe {
        return this.groupe as KfSuperGroupe;
    }

}
