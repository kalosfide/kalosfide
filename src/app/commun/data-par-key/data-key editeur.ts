import { PageDef } from '../page-def';
import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';
import { IDataKeyComponent } from './i-data-key-component';
import { IDataKey } from './data-key';

export abstract class DataKeyEditeur<T extends IDataKey> {
    protected groupe: KfGroupe;
    protected component: IDataKeyComponent;

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

    constructor(component: IDataKeyComponent) {
        this.component = component;
    }

    get pageDef(): PageDef {
        return this.component.pageDef;
    }

    protected abstract créeKfDeKey(): void;
    abstract fixeKfKey(key: IDataKey): void;
    protected abstract créeKfDeData(): void;

    protected ajouteChamps(...champs: KfComposant[]) {
        champs.forEach(c => this.kfDeData.push(c));
    }

    private prepareGroupe() {
        this.groupe.créeGereValeur();
        this.kfDeKey = [];
        this.créeKfDeKey();
        this.kfDeKey.forEach(c => this.groupe.ajoute(c));
        this.kfDeData = [];
        this.créeKfDeData();
        this.kfDeData.forEach(c => this.groupe.ajoute(c));
    }

    créeEdition(pageDef: PageDef) {
        this.groupe = new KfGroupe(pageDef.urlSegment);
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
        this.prepareGroupe();
        const superGroupe = this.groupe as KfSuperGroupe;
        superGroupe.quandTousAjoutés();
        return superGroupe;
    }
    get superGroupe(): KfSuperGroupe {
        return this.groupe as KfSuperGroupe;
    }

}
