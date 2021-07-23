import 'rxjs/add/observable/of';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { FormControl } from '@angular/forms';
import { KfStringDef } from '../../kf-partages/kf-string-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfEvenement, KfTypeDEvenement } from '../../kf-partages/kf-evenements';


export function KfNomFichier(nom: string): string {
    return nom + '_file';
}

export const TypeDeFichier = {
    texte: 'texte',
    objet: 'objet',
};

export class KfFichier extends KfComposant {

    typeDeFichier: string;

    files: File[];

    multiple: boolean;

    typesMime: string[];
    typesExtension: string[];
    _typesAcceptes: string;

    inputVisible: boolean;

    constructor(nom: string, texte?: KfStringDef) {
        super(KfNomFichier(nom), KfTypeDeComposant.fichier);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.typesMime = [];
        this.typesExtension = [];
        this.ajouteClasse('kf-fichier', 'kf-bouton');
        this.gereHtml.ajouteTraiteur(KfTypeDEvenement.change, (évènement: KfEvenement) => this.quandChange(évènement))
    }

    get idBouton(): string {
        return this.nom + '_b';
    }

    get typesAcceptes(): string {
        if (this._typesAcceptes) {
            return this._typesAcceptes;
        } else {
            return this.typesMime.concat(this.typesExtension).join(', ');
        }
    }
    set typesAcceptes(typesAcceptes: string) {
        this._typesAcceptes = typesAcceptes;
    }

    get formControl(): FormControl {
        return this.abstractControl as FormControl;
    }

    get nomsFichiers(): string {
        return this.files ? this.files.map(f => f.name).join(', ') : 'aucun';
    }

    protected _quandChange() {
        const files: FileList = (this.gereHtml.htmlElement as HTMLInputElement).files;
        this.files = [];
        for (let i = 0; i < files.length; i++) {
            this.files.push(files[i]);
        }
    }

    quandChange(évènement: KfEvenement) {
        this._quandChange();
    }
}
